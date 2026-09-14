-- ============================================================
-- Migration: 20260914020000_trip_notifications.sql
-- Description: Automatically notify friends when a new trip is created
-- ============================================================

CREATE OR REPLACE FUNCTION notify_friends_on_new_trip()
RETURNS TRIGGER AS $$
DECLARE
  v_creator_name TEXT;
  v_friend_record RECORD;
BEGIN
  -- Get creator's name
  SELECT full_name INTO v_creator_name FROM profiles WHERE id = NEW.creator_id;

  -- Notify all confirmed friends of the trip creator
  FOR v_friend_record IN
    SELECT 
      CASE 
        WHEN user_id = NEW.creator_id THEN friend_id 
        ELSE user_id 
      END AS friend_id
    FROM friendships
    WHERE (user_id = NEW.creator_id OR friend_id = NEW.creator_id)
      AND status = 'accepted'
  LOOP
    INSERT INTO notifications (user_id, type, from_user_id, entity_type, entity_id, content)
    VALUES (
      v_friend_record.friend_id,
      'new_trip',
      NEW.creator_id,
      'trip',
      NEW.id,
      COALESCE(v_creator_name, 'Um amigo') || ' organizou uma nova trip: ' || NEW.title
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_friends_on_new_trip ON trips;
CREATE TRIGGER trg_notify_friends_on_new_trip
  AFTER INSERT ON trips
  FOR EACH ROW
  EXECUTE FUNCTION notify_friends_on_new_trip();

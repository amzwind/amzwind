export type Locale = 'pt' | 'en' | 'es'

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export type TranslationKeys = {
  // Header
  navExperiencias: string
  navEscola: string
  navServicos: string
  navContato: string
  navLogin: string
  navAdmin: string
  navMinhaConta: string

  // Hero
  heroTagline: string
  heroTitle1: string
  heroTitleHighlight: string
  heroSubtitle: string
  heroCTA1: string
  heroCTA2: string

  // Experiências
  expLabel: string
  expTitle: string
  expSubtitle: string

  // Experiência cards
  exp1Title: string
  exp1Desc: string
  exp2Title: string
  exp2Desc: string
  exp3Title: string
  exp3Desc: string
  exp4Title: string
  exp4Desc: string

  badgeDownwind: string
  badgeExpedition: string
  badgeCultural: string
  levelIntermediate: string
  levelIntermediateAdv: string
  levelAll: string

  // KiteSchool
  ksLabel: string
  ksTitle: string
  ksSubtitle: string
  ksMostPopular: string
  ksSchedule: string
  ksBasic: string
  ksBasicIncludes: string[]
  ksBeginner: string
  ksBeginnerIncludes: string[]
  ksSpecific: string
  ksSpecificIncludes: string[]

  // Serviços
  svcLabel: string
  svcTitle: string
  svcSubtitle: string
  svc1Title: string
  svc1Desc: string
  svc1Price: string
  svc2Title: string
  svc2Desc: string
  svc2Price: string
  svc3Title: string
  svc3Desc: string
  svc3Price: string
  svc4Title: string
  svc4Desc: string
  svc4Price: string
  svcBook: string
  svcBookTitle: string
  svcBookSuccess: string
  svcDateLabel: string
  svcSchedule: string
  svcRequired: string
  svcServiceLabel: string

  // Footer
  footerAbout: string
  footerContact: string
  footerLocation: string
  footerRights: string

  // ═══════════════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════════════

  // Sidebar / Navigation
  adminDashboard: string
  adminExperiences: string
  adminProducts: string
  adminClasses: string
  adminBookings: string
  adminSettings: string
  adminLogout: string
  adminBackToSite: string

  // Dashboard Overview
  adminOverview: string
  adminTotalExperiences: string
  adminTotalProducts: string
  adminTotalBookings: string
  adminPendingBookings: string
  adminConfirmedBookings: string
  adminRevenue: string
  adminConnected: string
  adminRecentBookings: string
  adminNoBookings: string
  adminQuickActions: string

  // Experiences Manager
  adminExpTitle: string
  adminExpSubtitle: string
  adminNewExperience: string
  adminEditExperience: string
  adminExpFormTitle: string
  adminExpFormDescription: string
  adminExpFormCategory: string
  adminExpFormNewCategory: string
  adminExpFormSelectCategory: string
  adminExpFormPrice: string
  adminExpFormDuration: string
  adminExpFormLevel: string
  adminExpFormCommunity: string
  adminExpFormImageUrl: string
  adminExpFormVideoUrl: string
  adminExpFormFeatured: string
  adminExpFormCreate: string
  adminExpFormUpdate: string
  adminExpDeleteConfirm: string
  adminExpCreated: string
  adminExpUpdated: string
  adminExpDeleted: string
  adminExpNoData: string
  adminLevels: string[]

  // Products Manager
  adminProdTitle: string
  adminProdSubtitle: string
  adminNewProduct: string
  adminEditProduct: string
  adminProdFormTitle: string
  adminProdFormDescription: string
  adminProdFormPrice: string
  adminProdFormStock: string
  adminProdFormCategory: string
  adminProdFormImage: string
  adminProdFormCreate: string
  adminProdFormUpdate: string
  adminProdDeleteConfirm: string
  adminProdCreated: string
  adminProdUpdated: string
  adminProdDeleted: string
  adminProdNoData: string
  adminProdCategories: string[]

  // Classes Manager
  adminClassTitle: string
  adminClassSubtitle: string
  adminNewClass: string
  adminEditClass: string
  adminClassFormTitle: string
  adminClassFormDescription: string
  adminClassFormPrice: string
  adminClassFormDuration: string
  adminClassFormLevel: string
  adminClassFormInstructor: string
  adminClassFormCreate: string
  adminClassFormUpdate: string
  adminClassDeleteConfirm: string
  adminClassCreated: string
  adminClassUpdated: string
  adminClassDeleted: string
  adminClassNoData: string

  // Bookings Manager
  adminBookTitle: string
  adminBookSubtitle: string
  adminBookFilterAll: string
  adminBookFilterPending: string
  adminBookFilterConfirmed: string
  adminBookFilterCancelled: string
  adminBookConfirm: string
  adminBookCancel: string
  adminBookConfirmed: string
  adminBookCancelled: string
  adminBookNoData: string
  adminBookClient: string
  adminBookDate: string
  adminBookType: string
  adminBookStatus: string
  adminBookActions: string

  // Financial Manager
  adminFinancial: string
  adminAbout: string
  adminFinPayable: string
  adminFinReceivable: string
  adminFinPending: string
  adminFinPaid: string
  adminFinOverdue: string
  adminFinNewAccount: string
  adminFinEditAccount: string
  adminFinDescription: string
  adminFinAmount: string
  adminFinDueDate: string
  adminFinCategory: string
  adminFinNotes: string
  adminFinSave: string
  adminFinDeleteConfirm: string

  // About Page
  aboutTitle: string
  aboutSubtitle: string
  aboutMission: string
  aboutVision: string

  // Reviews
  adminReviews: string
  reviewsTitle: string
  reviewsAverage: string
  reviewsTotal: string
  reviewsWrite: string
  reviewsLoginToComment: string
  reviewsSubmit: string
  reviewsPendingNotice: string
  reviewsNoReviews: string
  reviewsReply: string
  reviewsReplyTo: string
  reviewsCancel: string
  reviewsRating: string
  reviewsComment: string
  reviewsSelectRating: string
  reviewsPending: string
  reviewsApproved: string
  reviewsRejected: string
  reviewsApprove: string
  reviewsReject: string
  reviewsDelete: string
  reviewsConfirmDelete: string
  reviewsAdminTitle: string
  reviewsAdminPending: string
  reviewsAdminAll: string

  // Favorites
  favorites: string

  // Cart / Checkout
  cartTitle: string
  cartEmpty: string
  cartAddExperience: string
  cartAddProduct: string
  cartAddClass: string
  cartTripDates: string
  cartCheckIn: string
  cartCheckOut: string
  cartNights: string
  cartBasePrice: string
  cartSubtotal: string
  cartTotal: string
  cartCheckout: string
  cartRemove: string
  cartDays: string
  cartPerNight: string
  cartSelectDates: string
  cartSummary: string
  cartAccommodation: string
  cartItemCount: string
  cartMyBookings: string
  navHome: string
  navProfile: string
  checkoutContactInfo: string
  checkoutName: string
  checkoutEmail: string
  checkoutPhone: string
  checkoutMessage: string
  checkoutNameRequired: string
  checkoutEmailRequired: string
  checkoutEmailInvalid: string
  checkoutError: string
  checkoutSuccess: string
  checkoutSuccessDetail: string
  checkoutProcessing: string
  checkoutLoginTitle: string
  checkoutLoginSubtitle: string
  checkoutLoginGoogle: string
  checkoutLoginDivider: string
  checkoutLoginEmail: string
  checkoutLoginPassword: string
  checkoutLoginButton: string
  checkoutLoginForgot: string
  checkoutLoginNoAccount: string
  checkoutLoggedInAs: string
  checkoutGuest: string
  loginLoading: string
  loginSubtitle: string
  loginEmail: string
  loginPassword: string
  loginButton: string
  loginAuthenticating: string
  loginBack: string

  // Common
  adminSave: string
  adminCancel: string
  adminDelete: string
  adminEdit: string
  adminCreate: string
  adminLoading: string
  adminError: string
  adminSuccess: string
  adminSearch: string
  adminNoResults: string
  adminConfirm: string
  adminBack: string
  adminNext: string
  adminOf: string

  // Contact & Newsletter
  contactTitle: string
  contactSubtitle: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactMessage: string
  contactSend: string
  contactSuccess: string
  newsletterTitle: string
  newsletterSubtitle: string
  newsletterPlaceholder: string
  newsletterButton: string
  newsletterSuccess: string
  newsletterAlready: string

  // Experience Detail
  expDetailBook: string
  expDetailDuration: string
  expDetailLevel: string
  expDetailCommunity: string
  expDetailIncludes: string
  expDetailRelated: string
  expDetailReviews: string
  expDetailNoReviews: string
  expDetailAddReview: string
  expDetailReviewName: string
  expDetailReviewText: string
  expDetailReviewSubmit: string

  // Product Pages
  prodCategoryTitle: string
  prodCategoryAll: string
  prodDetailAddToCart: string
  prodDetailInStock: string
  prodDetailOutOfStock: string
  prodDetailRelated: string
  prodDetailDescription: string

  // Customer Dashboard
  customerTitle: string
  customerSubtitle: string
  customerBookings: string
  customerNoBookings: string
  customerProfile: string
  customerName: string
  customerPhone: string
  customerEmail: string
  customerSave: string
  customerSaved: string
  customerError: string
  customerCancelBooking: string
  customerCancelConfirm: string
  customerCancelled: string
  customerBookingDate: string
  customerBookingType: string
  customerBookingStatus: string
  customerBookingNotes: string
  customerStatsTotal: string
  customerStatsConfirmed: string
  customerStatsPending: string
  customerStatusPending: string
  customerStatusConfirmed: string
  customerStatusCancelled: string
  customerTypeExperience: string
  customerTypeClass: string
  customerTypeProduct: string
  customerJoinDate: string

  // Admin - Manual Booking & Calendar
  adminManualBooking: string
  adminManualBookingTitle: string
  adminManualBookingClient: string
  adminManualBookingEmail: string
  adminManualBookingPhone: string
  adminManualBookingItem: string
  adminManualBookingDate: string
  adminManualBookingNotes: string
  adminManualBookingCreate: string
  adminManualBookingCreated: string
  adminCalendar: string
  adminCalendarTitle: string
  adminCalendarToday: string

  // Install App Banner (PWA)
  installTitle: string
  installSubtitle: string
  installFeature1: string
  installFeature2: string
  installFeature3: string
  installButton: string
  installNotNow: string
  installInstructionsTitle: string
  installIOSSubtitle: string
  installChromeSubtitle: string
  installIOSStep1: string
  installIOSStep2: string
  installIOSStep3: string
  installChromeStep1: string
  installChromeStep2: string
  installGotIt: string

  // Gallery
  galleryLabel: string
  galleryTitle: string
  gallerySubtitle: string
  galleryAll: string
  galleryViewFull: string

  // About Page - Values
  aboutValues: string
  aboutValue1Title: string
  aboutValue1Desc: string
  aboutValue2Title: string
  aboutValue2Desc: string
  aboutValue3Title: string
  aboutValue3Desc: string

  // About Page - Leadership
  aboutLeadership: string
  aboutLeader1Name: string
  aboutLeader1Role: string
  aboutLeader2Name: string
  aboutLeader2Role: string
  aboutLeader3Name: string
  aboutLeader3Role: string

  // About Page - Regions & Products
  aboutRegions: string
  aboutProducts: string

  // Chat & Social
  chatConversations: string
  chatSearchPlaceholder: string
  chatNoConversations: string
  chatStartConvo: string
  chatSendMessage: string
  chatTypeMessage: string
  chatOnline: string
  chatEmpty: string
  friendsTitle: string
  friendsList: string
  friendsRequests: string
  friendsFind: string
  friendsEmpty: string
  friendsNoRequests: string
  friendsSearchPlaceholder: string
  friendsNoResults: string
  friendsAdd: string
  friendsPending: string
  friendsAlreadyFriend: string
  friendsAccept: string
  friendsReject: string
  friendsRemove: string
  friendsRequestSent: string
  friendsRequestReceived: string
  notificationsTitle: string
  notificationsMarkAll: string
  notificationsEmpty: string
  navCommunity: string
  communityTitle: string
  communityEmpty: string
  communityLoginPrompt: string
  homeStartLabel: string
  homeStartTitle: string
  homeStartSubtitle: string
  homeStartExperiences: string
  homeStartExperiencesDesc: string
  homeStartTrips: string
  homeStartTripsDesc: string
  homeStartCommunity: string
  homeStartCommunityDesc: string
  homeStartProfile: string
  homeStartProfileDesc: string
  homeStartLogin: string
  homeStartLoginDesc: string
  homeStartGo: string
  shareTitle: string
  shareToChat: string
  shareConfirm: string
  shareSuccess: string
  shareError: string
  postComments: string
  postLikes: string
  postShares: string
  feedGlobal: string
  feedFriends: string
  feedEdited: string
  feedSaving: string
  feedSave: string
  feedCancel: string
  feedConfirmDelete: string
  feedLoading: string
  feedRetry: string
  feedEmpty: string
  feedEmptyHint: string
  feedLoadMore: string
  feedNoComments: string
  feedWriteComment: string
  feedSend: string
  feedComment: string
  feedShare: string
  navTrips: string
  tripsTitle: string
  tripsEmpty: string
  tripsEmptyHint: string
  tripParticipants: string
  tripJoined: string
  tripJoin: string
  tripLeave: string
  tripLeaveConfirm: string
  tripFull: string
  tripDetail: string
  tripNotFound: string
  tripOrganizedBy: string
  tripStatusPublished: string
  tripStatusFull: string
  tripStatusCancelled: string
  tripStatusCompleted: string
  tripStatusDraft: string
  tripCreate: string
  tripCreateButton: string
  tripCreateSuccess: string
  tripEdit: string
  tripSave: string
  tripSaving: string
  tripSaveSuccess: string
  tripUploading: string
  tripCoverLabel: string
  tripCoverUpload: string
  tripCoverTooLarge: string
  tripTitleLabel: string
  tripTitlePlaceholder: string
  tripDescriptionLabel: string
  tripDescriptionPlaceholder: string
  tripDestinationLabel: string
  tripDestinationPlaceholder: string
  tripStartDate: string
  tripEndDate: string
  tripDateError: string
  tripMaxParticipantsLabel: string
  tripMaxParticipantsPlaceholder: string
  tripMaxParticipantsError: string
  tripStatusLabel: string
  tripInvite: string
  tripInviteFriends: string
  tripInviteButton: string
  tripInvited: string
  tripNoFriendsToInvite: string
  tripChat: string
  tripTabInfo: string
  tripTabParticipants: string
  tripTabFeed: string
  tripNoParticipants: string
  tripRoleOrganizer: string
  tripRoleParticipant: string
  tripPending: string
  tripRemoveConfirm: string
  tripFeedEmpty: string
  tripFeedJoinFirst: string
  tripVisibilityLabel: string
  tripVisibilityPublic: string
  tripVisibilityPrivate: string

  // FASE 7 — UserProfile
  profileTabProfile: string
  profileTabBookings: string
  profileTabProducts: string
  profileTabGallery: string
  profileTabTrips: string
  profileTabFeed: string
  profileTabFriends: string
  profileTabChat: string
  profilePersonalData: string
  profileFullName: string
  profileFullNamePlaceholder: string
  profileBio: string
  profileBioPlaceholder: string
  profileEmail: string
  profilePhone: string
  profilePhonePlaceholder: string
  profileWhatsApp: string
  profileWhatsAppRequired: string
  profileSaving: string
  profileSave: string
  profileMemberSince: string
  profileBack: string
  profileStatsBookings: string
  profileStatsConfirmed: string
  profileStatsProducts: string
  profileStatsReservations: string
  profileNoBookings: string
  profileNoBookingsHint: string
  profileProductsPhysical: string
  profileProductsCount: string
  profileNoProducts: string
  profileNoProductsHint: string
  profileGoToShop: string
  profilePurchasedIn: string
  profileDelivered: string
  profilePendingConfirmation: string
  profileDeliveryStatus: string
  profileSessionsGallery: string
  profileSessionsDescription: string
  profileNoSessions: string
  profileNoSessionsHint: string
  profileSessionCompleted: string
  profileGallerySoon: string
  profileTripComments: string
  profileTripCommentsSoon: string
  profileMyTrips: string
  profileMyTripsDescription: string
  profileNoTrips: string
  profileNoTripsHint: string
  profileViewTrips: string
  profileStatusDraft: string
  profileStatusPublished: string
  profileStatusFull: string
  profileStatusCancelled: string
  profileStatusCompleted: string
  profileParticipants: string
  profileCommunityFeed: string
  profileCommunityFeedDescription: string
  profileErrorAvatar: string
  profileErrorSave: string
  profileSuccessSave: string
  profileBookingTypeExperience: string
  profileBookingTypeClass: string
  profileBookingTypeProduct: string

  // FASE 7 — KiteCoursePage
  kiteCourseTitle: string
  kiteCourseSubtitle: string
  kiteCourseIncludesTitle: string
  kiteCourseInclude1: string
  kiteCourseInclude2: string
  kiteCourseInclude3: string
  kiteCourseInclude4: string
  kiteCourseInclude5: string
  kiteCourseInclude6: string
  kiteCourseInclude7: string
  kiteCourseInclude8: string
  kiteCourseModule1Title: string
  kiteCourseModule1Desc: string
  kiteCourseModule2Title: string
  kiteCourseModule2Desc: string
  kiteCourseModule3Title: string
  kiteCourseModule3Desc: string
  kiteCourseTotalHours: string
  kiteCourseTotalClasses: string
  kiteCourseInvestment: string
  kiteCourseInvestmentSummary: string
  kiteCourseAbout: string
  kiteCourseAboutText: string
  kiteCourseWhatIncluded: string
  kiteCourseModules: string
  kiteCourseClasses: string
  kiteCourseGallery: string
  kiteCourseSchedule: string
  kiteCourseScheduleDescription: string
  kiteCourseTotalInvestment: string
  kiteCourseScheduleButton: string
  kiteCourseSelectDate: string
  kiteCourseReviews: string
  kiteCourseReviewsEmpty: string
  kiteCourseVideoSoon: string

  // FASE 7 — ExperienceDetail
  expDetailNotFound: string
  expDetailPackage: string
  expDetailIndividual: string
  expDetailFullPackage: string
  expDetailWhatIncluded: string
  expDetailWhatIncludedShort: string
  expDetailPackageTotal: string
  expDetailPerPerson: string
  expDetailBookingDate: string
  expDetailAddToCart: string
  expDetailSecurePayment: string
  expDetailUserFallback: string

  // FASE 7 — AdminDashboard
  adminAccessDenied: string
  adminHeroCover: string
  adminTrips: string
  adminLoadingDashboard: string
  adminPanel: string
  adminThemeLight: string
  adminThemeDark: string
  adminCollapse: string
  adminOnline: string

  // FASE 7 — Feed components
  feedErrorLoading: string
  feedPostError: string
  feedPostTripPlaceholder: string
  feedPostPlaceholder: string
  feedPostSuccess: string
  feedPostMedia: string
  feedPostSending: string
  feedPostPublishing: string
  feedPostButton: string
  feedCommentLoading: string
  feedCommentEmpty: string
  feedCommentPlaceholder: string
  feedCommentSend: string
  feedCommentSave: string
  feedCommentCancel: string
  feedCommentRider: string
  feedPostNow: string
  feedPostEdited: string
  feedPostDeleteConfirm: string
  feedPostErrorSave: string
  feedPostSaving: string
  feedPostSave: string
  feedPostComment: string
  feedPostShare: string

  // FASE 7 — Chat components
  chatRiderFallback: string
  chatDeletedMessage: string
  chatMessageFallback: string
  chatReply: string
  chatDelete: string
  chatCancel: string
  chatMessagePlaceholder: string

  // FASE 7 — ConversationsList
  convRiderFallback: string
  convYesterday: string
  convTitle: string
  convSearchPlaceholder: string
  convSearching: string
  convEmpty: string
  convStartChat: string

  // FASE 7 — Community
  communityLoginButton: string

  // FASE 7 — Notifications
  notificationNow: string
  notificationMin: string
  notificationHour: string
  notificationDay: string

  // FASE 7 — Friends
  friendsRiderFallback: string

  // FASE 7 — Products
  productNotFound: string
  productAddedToCart: string
  productInCart: string
  productContinueShopping: string
  productViewCart: string
  productOutOfStock: string
  productViewOthers: string

  // FASE 7 — Wishlist
  wishlistAlreadyInCart: string
  wishlistAdded: string
  wishlistRemoved: string
  wishlistTitle: string
  wishlistSubtitle: string
  wishlistEmpty: string
  wishlistEmptyHint: string
  wishlistInCart: string
  wishlistAddToCart: string
  wishlistRemove: string
  wishlistItem: string
  wishlistItems: string

  // FASE 7 — Trips (error/status)
  tripErrorLoad: string
  tripErrorJoin: string
  tripErrorLeave: string
  tripErrorInvite: string
  tripErrorRemove: string
  tripErrorCreate: string
  tripErrorSave: string
  tripErrorUpload: string
  tripNotAuthenticated: string
  tripStatusPublic: string
  tripStatusPrivate: string
  tripAgo: string

  // FASE 7 — ShareDialog
  shareRiderFallback: string
  shareGroupFallback: string
  shareTripFallback: string
  shareConvFallback: string
  shareSent: string

  // FASE 7 — FavoriteButton
  favRemoveAria: string
  favAddAria: string

  // FASE 7 — Header
  headerMenu: string
  headerAbout: string
  headerToggleTheme: string
  headerUserFallback: string
  headerMyProfile: string
  headerAdminPanel: string
  headerLogin: string
  headerCart: string

  // FASE 7 — CartCheckout
  checkoutTestimonial1: string
  checkoutTestimonial2: string
  checkoutTestimonial3: string
  checkoutEmpty: string
  checkoutEmptyHint: string
  checkoutSummary: string
  checkoutSubtotal: string
  checkoutPixDiscount: string
  checkoutTotal: string
  checkoutWhatsApp: string
  checkoutFilled: string
  checkoutPaymentMethod: string
  checkoutCard: string
  checkoutUpTo: string
  checkoutInternational: string
  checkoutPixInstant: string
  checkoutPixDiscountApplied: string
  checkoutPixKey: string
  checkoutPixCopy: string
  checkoutPixCopied: string
  checkoutCardPlaceholder: string
  checkoutCardName: string
  checkoutInstallments: string
  checkoutInterestFree: string
  checkoutPaypalTitle: string
  checkoutPaypalDescription: string
  checkoutConfirmPayment: string
  checkoutTestimonialsTitle: string
  checkoutSecurePayment: string
  checkoutEncryptedPayment: string
  checkoutGuarantee: string
  checkoutWhatsAppSupport: string
  checkoutAddItemFirst: string
  checkoutWhatsAppRequired: string
  checkoutCreateAccount: string
  checkoutItemRemoved: string

  // FASE 7 — Splash / ProtectedRoute
  splashSubtitle: string
  protectedRouteLoading: string

  // FASE 7 — Admin components (heroes)
  heroSlideLimit: string
  heroMediaRequired: string
  heroTitleRequired: string
  heroSlideUpdated: string
  heroSlideCreated: string
  heroSlideRemoved: string
  heroSlideDeleted: string
  heroManageTitle: string
  heroManageDescription: string
  heroSlideCount: string
  heroNewSlide: string
  heroDimensionTip: string
  heroUploadTip: string
  heroLoading: string
  heroNoSlides: string
  heroCreateFirst: string
  heroTypeYoutube: string
  heroTypeVideo: string
  heroTypeImage: string
  heroOfficial: string
  heroCtaPrefix: string
  heroMoveUp: string
  heroMoveDown: string
  heroEdit: string
  heroDelete: string
  heroEditSlide: string
  heroNewSlideTitle: string
  heroTitleLabel: string
  heroTitlePlaceholder: string
  heroSubtitleLabel: string
  heroSubtitlePlaceholder: string
  heroMediaTypeLabel: string
  heroOrderLabel: string
  heroUploadLabel: string
  heroUrlLabel: string
  heroUrlPlaceholder: string
  heroCtaTextLabel: string
  heroCtaTextPlaceholder: string
  heroCtaLinkLabel: string
  heroCancel: string
  heroSaving: string
  heroUpdate: string
  heroCreate: string
  heroDeleteTitle: string
  heroDeleteConfirm: string
  heroDeleteYes: string

  // FASE 7 — Admin components (bookings)
  bookingUpdated: string
  bookingDeleted: string
  bookingTypeExperience: string
  bookingTypeClass: string
  bookingTypeProduct: string
  bookingConfirmAction: string
  bookingPaid: string
  bookingDetails: string
  bookingClientInfo: string
  bookingFieldName: string
  bookingFieldEmail: string
  bookingFieldWhatsApp: string
  bookingFieldPhone: string
  bookingNoContact: string
  bookingReservationDetails: string
  bookingFieldType: string
  bookingFieldItemId: string
  bookingReservedItems: string
  bookingStatusPending: string
  bookingStatusConfirmed: string
  bookingStatusCancelled: string
  bookingDate: string
  bookingNotes: string
  bookingCancel: string
  bookingDelete: string
  bookingSaving: string
  bookingSave: string
  bookingDeleteTitle: string
  bookingDeleteConfirm: string

  // FASE 7 — Admin components (classes)
  classErrorLoad: string
  classErrorUpdate: string
  classUpdated: string
  classErrorCreate: string
  classCreated: string
  classErrorDelete: string
  classDeleted: string
  classLoading: string
  classManageTitle: string
  classManageDescription: string
  classNewButton: string
  classEmpty: string
  classEdit: string
  classDelete: string
  classEditTitle: string
  classNewTitle: string
  classFieldTitle: string
  classFieldTitlePlaceholder: string
  classFieldPrice: string
  classFieldDuration: string
  classFieldDurationPlaceholder: string
  classFieldLevel: string
  classFieldLevelPlaceholder: string
  classFieldDescription: string
  classFieldImage: string
  classFieldVideo: string
  classCancel: string
  classSaving: string
  classUpdate: string
  classCreate: string
  classDeleteTitle: string
  classDeleteConfirm: string

  // FASE 7 — Admin components (about)
  aboutTitleRequired: string
  aboutUpdated: string
  aboutCreated: string
  aboutManageTitle: string
  aboutManageDescription: string
  aboutEditContent: string
  aboutLoading: string
  aboutMainContent: string
  aboutFieldTitle: string
  aboutFieldTitlePlaceholder: string
  aboutFieldSubtitle: string
  aboutFieldSubtitlePlaceholder: string
  aboutFieldDescription: string
  aboutFieldDescriptionPlaceholder: string
  aboutMissionVision: string
  aboutFieldMission: string
  aboutFieldMissionPlaceholder: string
  aboutFieldVision: string
  aboutFieldVisionPlaceholder: string
  aboutMedia: string
  aboutCoverImage: string
  aboutCoverUrl: string
  aboutVideoUrl: string
  aboutGallery: string
  aboutGalleryPlaceholder: string
  aboutAddButton: string
  aboutCancel: string
  aboutSaving: string
  aboutUpdate: string
  aboutCreate: string
  aboutUnsavedData: string
  aboutLabelTitle: string
  aboutLabelSubtitle: string
  aboutLabelDescription: string
  aboutLabelMission: string
  aboutLabelVision: string
  aboutLabelMedia: string
  aboutLabelCover: string
  aboutLabelVideo: string
  aboutGalleryCount: string

  // FASE 7 — Admin components (products)
  productAdminName: string
  productAdminPrice: string
  productAdminStock: string
  productAdminActions: string
  productAdminUnit: string
  productAdminEdit: string
  productAdminDelete: string
  productAdminCategoryPlaceholder: string
  productAdminCancel: string
  productAdminNew: string

  // FASE 7 — Admin components (trips)
  tripAdminStatusUpdated: string
  tripAdminError: string
  tripAdminDeleteConfirm: string
  tripAdminDeleted: string
  tripAdminDraft: string
  tripAdminPublished: string
  tripAdminFull: string
  tripAdminCancelled: string
  tripAdminCompleted: string
  tripAdminPublic: string
  tripAdminPrivate: string
  tripAdminAll: string
  tripAdminEmpty: string
  tripAdminParticipants: string

  // FASE 7 — Admin components (shared)
  sharedStatusPending: string
  sharedStatusConfirmed: string
  sharedStatusCancelled: string
  sharedUploadError: string
  sharedUploading: string
  sharedChooseVideo: string
  sharedChooseImage: string

  // FASE 7 — Admin components (financial)
  financialStatusPending: string
  financialStatusPaid: string
  financialStatusOverdue: string
  financialTypePayable: string
  financialTypeReceivable: string
  financialCategoryRent: string
  financialCategoryEquipment: string
  financialCategoryMarketing: string
  financialCategorySalaries: string
  financialCategoryServices: string
  financialCategoryOperations: string
  financialCategoryClasses: string
  financialCategoryExpeditions: string
  financialCategoryProducts: string
  financialCategoryOther: string
  financialUpdated: string
  financialCreated: string
  financialDeleted: string
  financialSummary: string
  financialPay: string
  financialReceive: string
  financialBalance: string
  financialFilters: string
  financialAllTypes: string
  financialAllStatuses: string
  financialNewEntry: string
  financialEntries: string
  financialItems: string
  financialEmpty: string
  financialFieldDescription: string
  financialFieldDescriptionPlaceholder: string
  financialFieldType: string
  financialFieldValue: string
  financialFieldDueDate: string
  financialFieldCategory: string
  financialFieldCategoryPlaceholder: string
  financialFieldStatus: string
  financialFieldNotes: string
  financialFieldNotesPlaceholder: string
  financialCancel: string
  financialSaving: string
  financialUpdate: string
  financialCreate: string
  financialDeleteTitle: string
  financialDeleteConfirm: string

  // FASE 7 — Admin components (experiences)
  expAdminPackage: string
  expAdminIndividual: string
  expAdminItemsIncluded: string
  expAdminTypeLabel: string
  expAdminTypeIndividual: string
  expAdminTypeIndividualDesc: string
  expAdminTypePackage: string
  expAdminTypePackageDesc: string
  expAdminCategoryPlaceholder: string
  expAdminCancel: string
  expAdminNew: string
  expAdminOriginalPrice: string
  expAdminOriginalPricePlaceholder: string
  expAdminOriginalPriceHelp: string
  expAdminIncludedItems: string
  expAdminIncludedPlaceholder: string
  expAdminIncludedHelp: string

  // FASE 7 — Experiencias (landing section)
  expLandingDiscover: string
  expLandingTitle: string
  expLandingDescription: string
  expLandingDetails: string

  // FASE 7 — KiteSchool component
  kiteSchoolAlt: string

  // FASE 7 — ContactNewsletter
  contactSendAnother: string

  // FASE 7 — Servicos
  svcWhatsAppRequired: string
  svcDepartureAfterArrival: string

  // FASE 7 — Footer
  footerWhatsApp: string

  // FASE 7 — InstallAppBanner
  bannerClose: string

  // Accessibility aria-labels
  ariaAttach: string
  ariaLike: string
  ariaUnlike: string

  // Admin — Hero (additional keys)
  heroManageSubtitle: string
  heroDimensionHelp: string
  heroEmpty: string
  heroBadgeYouTube: string
  heroBadgeVideo: string
  heroBadgeImage: string
  heroBadgeOfficial: string
  heroCTA: string
  heroHighlightTitle: string
  heroHighlightPlaceholder: string
  heroMediaType: string
  heroOrder: string
  heroUploadFile: string
  heroOrPasteUrl: string
  heroButtonText: string
  heroButtonLink: string
  heroSaveSlide: string
  heroLimitReached: string
  heroOfficialRemoved: string

  // Admin — Financial (additional keys)
  finPending: string
  finPaid: string
  finOverdue: string
  finPayable: string
  finReceivable: string
  finAccountUpdated: string
  finAccountCreated: string
  finAccountDeleted: string
  finSummary: string
  finToPay: string
  finToReceive: string
  finBalance: string
  finReceived: string
  finFilters: string
  finAllTypes: string
  finAllStatuses: string
  finNewAccount: string
  finTransactions: string
  finItems: string
  finLoading: string
  finEmpty: string
  finDescription: string
  finType: string
  finCategory: string
  finAmount: string
  finDueDate: string
  finStatus: string
  finActions: string
  finEdit: string
  finDelete: string
  finEditAccount: string
  finNewAccountTitle: string
  finFormType: string
  finFormDescription: string
  finFormDescriptionPlaceholder: string
  finFormAmount: string
  finFormDueDate: string
  finFormCategory: string
  finFormSelect: string
  finFormStatus: string
  finFormNotes: string
  finFormNotesPlaceholder: string
  finFormCancel: string
  finFormSaving: string
  finFormCreate: string
  finDeleteTitle: string
  finDeleteConfirm: string
  finCategoryRent: string
  finCategoryEquipment: string
  finCategoryMarketing: string
  finCategorySalaries: string
  finCategoryServices: string
  finCategoryOperational: string
  finCategoryClassRevenue: string
  finCategoryExpeditionRevenue: string
  finCategoryProductRevenue: string
  finCategoryOther: string

  // Admin — Trips (additional keys)
  tripsAll: string
  tripsParticipants: string
  tripsDraft: string
  tripsPublished: string
  tripsFull: string
  tripsCancelled: string
  tripsCompleted: string
  tripsPublic: string
  tripsPrivate: string
  tripsStatusUpdated: string
  tripsDeleteTitle: string
  tripsDeleted: string

  // Admin — Classes (additional keys)
  classesTitle: string
  classesSubtitle: string
  classesNew: string
  classesEmpty: string
  classesEdit: string
  classesDelete: string
  classesEditTitle: string
  classesNewTitle: string
  classesFormTitle: string
  classesFormTitlePlaceholder: string
  classesFormPrice: string
  classesFormDuration: string
  classesFormDurationPlaceholder: string
  classesFormLevel: string
  classesFormLevelPlaceholder: string
  classesFormDescription: string
  classesFormImage: string
  classesFormVideo: string
  classesCancel: string
  classesSaving: string
  classesUpdate: string
  classesCreate: string
  classesDeleteTitle: string
  classesDeleteConfirm: string
  classesUpdated: string
  classesCreated: string
  classesDeleted: string
  classesLoadError: string
  classesUpdateError: string
  classesCreateError: string
  classesDeleteError: string
  classesLoading: string

  // Admin — About (additional keys)
  aboutTitleLabel: string
  aboutSubtitleLabel: string
  aboutSubtitlePlaceholder: string
  aboutDescription: string
  aboutDescriptionPlaceholder: string
  aboutMissionPlaceholder: string
  aboutVisionPlaceholder: string
  aboutGalleryAlt: string
  aboutAdd: string
  aboutUnsaved: string

  // Admin — Products (additional keys)
  prodProduct: string
  prodPrice: string
  prodStock: string
  prodActions: string
  prodUnit: string
  prodEdit: string
  prodDelete: string
  prodNewCategory: string
  prodCancel: string
  prodNew: string

  // Admin — Experiences (additional keys)
  expTypePackage: string
  expTypeIndividual: string
  expItemsIncluded: string
  expTypeLabel: string
  expTypeIndividualBtn: string
  expTypeIndividualDesc: string
  expTypePackageBtn: string
  expTypePackageDesc: string
  expNewCategory: string
  expCancel: string
  expNew: string
  expOriginalPrice: string
  expOriginalPriceHelp: string
  expIncludes: string
  expIncludesHelp: string

  // Admin — Bookings (additional keys)
  bookingGuest: string
  bookingPaymentConfirmed: string
  bookingName: string
  bookingEmail: string
  bookingWhatsApp: string
  bookingPhone: string
  bookingStatusLabel: string
  bookingDateLabel: string

  // Admin — Shared (additional keys)
  sharedPending: string
  sharedConfirmed: string
  sharedCancelled: string
  sharedSending: string

  // Admin — Reviews (additional keys)
  reviewUser: string
  reviewDeleted: string
}

const pt: TranslationKeys = {
  navExperiencias: 'Experiências',
  navEscola: 'Escola',
  navServicos: 'Serviços',
  navContato: 'Contato',

  heroTagline: 'Expedições · Downwinds · Experiências na Amazônia Atlântica',
  heroTitle1: 'A Amazônia é o nosso',
  heroTitleHighlight: 'ponto de partida',
  heroSubtitle: 'Não queremos apenas organizar viagens. Queremos revelar um território.',
  heroCTA1: 'Ver Experiências',
  heroCTA2: 'Agendar Aula',

  expLabel: 'Descubra',
  expTitle: 'Experiências & Downwinds',
  expSubtitle: 'Rotas exclusivas pela Amazônia Atlântica. Cada trajeto é uma nova aventura.',

  exp1Title: 'Ajuruteua → Salinas',
  exp1Desc: 'Navegue entre praias selvagens e águas cristalinas do Pará. Vento constante e ondas perfeitas para um downwind inesquecível.',
  exp2Title: 'Salinas → Algodoal',
  exp2Desc: 'Expedição completa entre ilhas paradisíacas. Parada para mergulho e contemplação da fauna amazônica.',
  exp3Title: 'Voo dos Guarás',
  exp3Desc: 'Acompanhe o voo dos guarás vermelhos ao entardecer. Uma experiência mágica de contemplação e natureza.',
  exp4Title: 'Carimbó na Praia',
  exp4Desc: 'Roda de Carimbó com mestres locais ao som do mar. Mergulho na cultura e no ritmo amazônico.',

  badgeDownwind: 'Downwind',
  badgeExpedition: 'Expedição',
  badgeCultural: 'Vivência Cultural',
  levelIntermediate: 'Intermediário',
  levelIntermediateAdv: 'Intermediário/Avançado',
  levelAll: 'Todos os níveis',

  ksLabel: 'Aprenda',
  ksTitle: 'KiteSchool',
  ksSubtitle: 'Aulas particulares e em grupo com instrutores certificados. Do primeiro voo à independência.',
  ksMostPopular: 'Mais Popular',
  ksSchedule: 'Agendar Aula',
  ksBasic: 'Básico',
  ksBasicIncludes: ['Teoria na praia', 'Montagem do equipamento', 'Primeiros voos na areia', 'Supervisão individual'],
  ksBeginner: 'Iniciante',
  ksBeginnerIncludes: ['Revisão de segurança', 'Controle na água', 'Voo assistido', 'Prática de manobras básicas'],
  ksSpecific: 'Específico',
  ksSpecificIncludes: ['Técnica avançada', 'Downwind guiado', 'Corte e transição', 'Análise de vídeo'],

  svcLabel: 'Complementos',
  svcTitle: 'Serviços & Produtos',
  svcSubtitle: 'Tudo que você precisa para sua experiência amazônica, em um só lugar.',
  svc1Title: 'Camisas UV',
  svc1Desc: 'Proteção solar com design da Amazon Wind. Tecido technical de secagem rápida.',
  svc1Price: 'A partir de R$ 89',
  svc2Title: 'Bonés',
  svc2Desc: 'Bonés com abas bordadas. Ideais para os ventos amazônicos.',
  svc2Price: 'A partir de R$ 59',
  svc3Title: 'Transfer',
  svc3Desc: 'Recolocação e transfer entre praias. Veículos adaptados para areia.',
  svc3Price: 'Sob consulta',
  svc4Title: 'Hospedagem',
  svc4Desc: 'Parceria com pousadas e residências em Salinópolis e Ajuruteua.',
  svc4Price: 'Sob consulta',
  svcBook: 'Agendar',
  svcBookTitle: 'Agendar Serviço',
  svcBookSuccess: 'Solicitação enviada com sucesso! Entraremos em contato.',
  svcDateLabel: 'Data preferida',
  svcSchedule: 'Agendar agora',
  svcRequired: 'Campos obrigatórios',
  svcServiceLabel: 'Serviço',

  footerAbout: 'Escola de Kitesurf e Expedições na Amazônia Atlântica. Fundada por Pingo, Pablo e Rafael.',
  footerContact: 'Contato',
  footerLocation: 'Localização',
  footerRights: 'Todos os direitos reservados.',

  // ═══ ADMIN ═══
  adminDashboard: 'Painel',
  adminExperiences: 'Experiências',
  adminProducts: 'Produtos',
  adminClasses: 'Aulas',
  adminBookings: 'Reservas',
  adminSettings: 'Configurações',
  adminLogout: 'Sair',
  adminBackToSite: 'Voltar ao Site',

  adminOverview: 'Visão Geral',
  adminTotalExperiences: 'Total de Experiências',
  adminTotalProducts: 'Total de Produtos',
  adminTotalBookings: 'Total de Reservas',
  adminPendingBookings: 'Pendentes',
  adminConfirmedBookings: 'Confirmadas',
  adminRevenue: 'Receita',
  adminConnected: 'Conectado',
  adminRecentBookings: 'Reservas Recentes',
  adminNoBookings: 'Nenhuma reserva ainda',
  adminQuickActions: 'Ações Rápidas',

  adminExpTitle: 'Experiências & Downwinds',
  adminExpSubtitle: 'Gerencie roteiros, expedições e vivências culturais',
  adminNewExperience: 'Nova Experiência',
  adminEditExperience: 'Editar Experiência',
  adminExpFormTitle: 'Título',
  adminExpFormDescription: 'Descrição',
  adminExpFormCategory: 'Categoria',
  adminExpFormNewCategory: 'Nova Categoria',
  adminExpFormSelectCategory: 'Selecione uma categoria',
  adminExpFormPrice: 'Preço (R$)',
  adminExpFormDuration: 'Duração',
  adminExpFormLevel: 'Nível',
  adminExpFormCommunity: 'Comunidade',
  adminExpFormImageUrl: 'URL da Imagem',
  adminExpFormVideoUrl: 'URL do Vídeo',
  adminExpFormFeatured: 'Destaque na página inicial',
  adminExpFormCreate: 'Criar Experiência',
  adminExpFormUpdate: 'Atualizar',
  adminExpDeleteConfirm: 'Tem certeza que deseja excluir esta experiência?',
  adminExpCreated: 'Experiência criada com sucesso!',
  adminExpUpdated: 'Experiência atualizada!',
  adminExpDeleted: 'Experiência excluída.',
  adminExpNoData: 'Nenhuma experiência cadastrada',
  adminLevels: ['Iniciante', 'Intermediário', 'Avançado', 'Todos os níveis'],

  adminProdTitle: 'Produtos & E-commerce',
  adminProdSubtitle: 'Gerencie estoque, preços e categorias de produtos',
  adminNewProduct: 'Novo Produto',
  adminEditProduct: 'Editar Produto',
  adminProdFormTitle: 'Nome do Produto',
  adminProdFormDescription: 'Descrição',
  adminProdFormPrice: 'Preço (R$)',
  adminProdFormStock: 'Estoque',
  adminProdFormCategory: 'Categoria',
  adminProdFormImage: 'URL da Imagem',
  adminProdFormCreate: 'Criar Produto',
  adminProdFormUpdate: 'Atualizar',
  adminProdDeleteConfirm: 'Tem certeza que deseja excluir este produto?',
  adminProdCreated: 'Produto criado com sucesso!',
  adminProdUpdated: 'Produto atualizado!',
  adminProdDeleted: 'Produto excluído.',
  adminProdNoData: 'Nenhum produto cadastrado',
  adminProdCategories: ['Vestuário', 'Equipamento', 'Acessório', 'Consumível'],

  adminClassTitle: 'Aulas & KiteSchool',
  adminClassSubtitle: 'Gerencie pacotes de aulas, instrutores e horários',
  adminNewClass: 'Nova Aula',
  adminEditClass: 'Editar Aula',
  adminClassFormTitle: 'Nome da Aula',
  adminClassFormDescription: 'Descrição',
  adminClassFormPrice: 'Preço (R$)',
  adminClassFormDuration: 'Duração',
  adminClassFormLevel: 'Nível',
  adminClassFormInstructor: 'Instrutor',
  adminClassFormCreate: 'Criar Aula',
  adminClassFormUpdate: 'Atualizar',
  adminClassDeleteConfirm: 'Tem certeza que deseja excluir esta aula?',
  adminClassCreated: 'Aula criada com sucesso!',
  adminClassUpdated: 'Aula atualizada!',
  adminClassDeleted: 'Aula excluída.',
  adminClassNoData: 'Nenhuma aula cadastrada',

  adminBookTitle: 'Reservas & Agenda',
  adminBookSubtitle: 'Visualize e gerencie todas as reservas',
  adminBookFilterAll: 'Todas',
  adminBookFilterPending: 'Pendentes',
  adminBookFilterConfirmed: 'Confirmadas',
  adminBookFilterCancelled: 'Canceladas',
  adminBookConfirm: 'Confirmar',
  adminBookCancel: 'Cancelar',
  adminBookConfirmed: 'Reserva confirmada!',
  adminBookCancelled: 'Reserva cancelada.',
  adminBookNoData: 'Nenhuma reserva encontrada',
  adminBookClient: 'Cliente',
  adminBookDate: 'Data',
  adminBookType: 'Tipo',
  adminBookStatus: 'Status',
  adminBookActions: 'Ações',

  // Financial Manager
  adminFinancial: 'Financeiro',
  adminAbout: 'Sobre',
  adminFinPayable: 'A Pagar',
  adminFinReceivable: 'A Receber',
  adminFinPending: 'Pendente',
  adminFinPaid: 'Pago',
  adminFinOverdue: 'Atrasado',
  adminFinNewAccount: 'Nova Conta',
  adminFinEditAccount: 'Editar Conta',
  adminFinDescription: 'Descrição',
  adminFinAmount: 'Valor',
  adminFinDueDate: 'Vencimento',
  adminFinCategory: 'Categoria',
  adminFinNotes: 'Observações',
  adminFinSave: 'Salvar',
  adminFinDeleteConfirm: 'Tem certeza que deseja excluir esta conta?',

  // About Page
  aboutTitle: 'Sobre a Amazon Wind',
  aboutSubtitle: 'Escola de Kitesurf & Expedições na Amazônia Atlântica',
  aboutMission: 'Missão',
  aboutVision: 'Visão',

  // Reviews
  adminReviews: 'Avaliações',
  reviewsTitle: 'Avaliações & Comentários',
  reviewsAverage: 'Média',
  reviewsTotal: 'avaliações',
  reviewsWrite: 'Deixe sua avaliação',
  reviewsLoginToComment: 'Faça login para comentar',
  reviewsSubmit: 'Enviar avaliação',
  reviewsPendingNotice: 'Seu comentário passará por moderação antes de ser publicado.',
  reviewsNoReviews: 'Nenhuma avaliação ainda. Seja o primeiro!',
  reviewsReply: 'Responder',
  reviewsReplyTo: 'Responder a',
  reviewsCancel: 'Cancelar',
  reviewsRating: 'Sua nota',
  reviewsComment: 'Seu comentário',
  reviewsSelectRating: 'Selecione uma nota',
  reviewsPending: 'Pendente',
  reviewsApproved: 'Aprovado',
  reviewsRejected: 'Rejeitado',
  reviewsApprove: 'Aprovar',
  reviewsReject: 'Rejeitar',
  reviewsDelete: 'Excluir',
  reviewsConfirmDelete: 'Tem certeza que deseja excluir esta avaliação?',
  reviewsAdminTitle: 'Gerenciar Avaliações',
  reviewsAdminPending: 'Pendentes',
  reviewsAdminAll: 'Todas',

  favorites: 'Favoritos',

  cartTitle: 'Carrinho',
  cartEmpty: 'Seu carrinho está vazio',
  cartAddExperience: 'Adicionar Experiência',
  cartAddProduct: 'Adicionar Produto',
  cartAddClass: 'Adicionar Aula',
  cartTripDates: 'Datas da Viagem',
  cartCheckIn: 'Chegada',
  cartCheckOut: 'Saida',
  cartNights: 'Noites',
  cartBasePrice: 'Preço Base / Noite',
  cartSubtotal: 'Subtotal',
  cartTotal: 'Total',
  cartCheckout: 'Finalizar Reserva',
  cartRemove: 'Remover',
  cartDays: 'dias',
  cartPerNight: 'por noite',
  cartSelectDates: 'Selecione as datas da viagem',
  cartSummary: 'Resumo',
  cartAccommodation: 'Hospedagem',
  cartItemCount: 'itens no carrinho',
  cartMyBookings: 'Minhas Reservas',
  navHome: 'Início',
  navProfile: 'Perfil',
  checkoutContactInfo: 'Dados de Contato',
  checkoutName: 'Nome',
  checkoutEmail: 'E-mail',
  checkoutPhone: 'Telefone',
  checkoutMessage: 'Mensagem',
  checkoutNameRequired: 'Informe seu nome.',
  checkoutEmailRequired: 'Informe seu e-mail.',
  checkoutEmailInvalid: 'E-mail inválido.',
  checkoutError: 'Erro ao criar reserva(s).',
  checkoutSuccess: 'Reserva confirmada!',
  checkoutSuccessDetail: 'Voce recebera um e-mail de confirmacao em breve. Acompanhe suas reservas no painel.',
  checkoutProcessing: 'Processando...',
  checkoutLoginTitle: 'Entrar para continuar',
  checkoutLoginSubtitle: 'Acesse sua conta para finalizar a reserva',
  checkoutLoginGoogle: 'Entrar com Google',
  checkoutLoginDivider: 'ou',
  checkoutLoginEmail: 'E-mail',
  checkoutLoginPassword: 'Senha',
  checkoutLoginButton: 'Entrar',
  checkoutLoginForgot: 'Esqueceu a senha?',
  checkoutLoginNoAccount: 'Nao tem conta?',
  checkoutLoggedInAs: 'Conectado como',
  checkoutGuest: 'Continuar como visitante',
  loginLoading: 'Carregando...',
  loginSubtitle: 'Acesse sua conta',
  loginEmail: 'E-mail',
  loginPassword: 'Senha',
  loginButton: 'Entrar',
  loginAuthenticating: 'Autenticando...',
  loginBack: '← Voltar para o site principal',

  adminSave: 'Salvar',
  adminCancel: 'Cancelar',
  adminDelete: 'Excluir',
  adminEdit: 'Editar',
  adminCreate: 'Criar',
  adminLoading: 'Carregando...',
  adminError: 'Erro',
  adminSuccess: 'Sucesso',
  adminSearch: 'Buscar...',
  adminNoResults: 'Nenhum resultado encontrado',
  adminConfirm: 'Confirmar',
  adminBack: 'Voltar',
  adminNext: 'Próximo',
  adminOf: 'de',

  navLogin: 'Entrar',
  navAdmin: 'Admin',
  navMinhaConta: 'Minha Conta',

  contactTitle: 'Fale Conosco',
  contactSubtitle: 'Tem dúvidas? Envie uma mensagem.',
  contactName: 'Nome',
  contactEmail: 'E-mail',
  contactPhone: 'Telefone',
  contactMessage: 'Mensagem',
  contactSend: 'Enviar Mensagem',
  contactSuccess: 'Mensagem enviada com sucesso!',
  newsletterTitle: 'Fique por dentro',
  newsletterSubtitle: 'Receba novidades, promoções e dicas de kitesurf.',
  newsletterPlaceholder: 'Seu melhor e-mail',
  newsletterButton: 'Inscrever',
  newsletterSuccess: 'Inscrição realizada com sucesso!',
  newsletterAlready: 'Este e-mail já está cadastrado.',

  expDetailBook: 'Reservar Agora',
  expDetailDuration: 'Duração',
  expDetailLevel: 'Nível',
  expDetailCommunity: 'Comunidade',
  expDetailIncludes: 'O que está incluso',
  expDetailRelated: 'Experiências Relacionadas',
  expDetailReviews: 'Avaliações',
  expDetailNoReviews: 'Nenhuma avaliação ainda. Seja o primeiro!',
  expDetailAddReview: 'Deixar Avaliação',
  expDetailReviewName: 'Seu nome',
  expDetailReviewText: 'Sua avaliação',
  expDetailReviewSubmit: 'Enviar Avaliação',

  prodCategoryTitle: 'Produtos',
  prodCategoryAll: 'Todos',
  prodDetailAddToCart: 'Adicionar ao Carrinho',
  prodDetailInStock: 'Em estoque',
  prodDetailOutOfStock: 'Esgotado',
  prodDetailRelated: 'Produtos Relacionados',
  prodDetailDescription: 'Descrição',

  customerTitle: 'Minha Conta',
  customerSubtitle: 'Gerencie suas reservas e dados pessoais',
  customerBookings: 'Minhas Reservas',
  customerNoBookings: 'Você ainda não tem reservas.',
  customerProfile: 'Perfil',
  customerName: 'Nome Completo',
  customerPhone: 'Telefone',
  customerSave: 'Salvar Alterações',
  customerSaved: 'Perfil atualizado!',
  customerError: 'Erro ao salvar. Tente novamente.',
  customerCancelBooking: 'Cancelar',
  customerCancelConfirm: 'Tem certeza que deseja cancelar esta reserva?',
  customerCancelled: 'Reserva cancelada.',
  customerBookingDate: 'Data',
  customerBookingType: 'Tipo',
  customerBookingStatus: 'Status',
  customerBookingNotes: 'Observações',
  customerStatsTotal: 'Total',
  customerStatsConfirmed: 'Confirmadas',
  customerStatsPending: 'Pendentes',
  customerStatusPending: 'Pendente',
  customerStatusConfirmed: 'Confirmada',
  customerStatusCancelled: 'Cancelada',
  customerTypeExperience: 'Experiência',
  customerTypeClass: 'Aula',
  customerTypeProduct: 'Produto',
  customerJoinDate: 'Membro desde',
  customerEmail: 'E-mail',

  adminManualBooking: 'Reserva Manual',
  adminManualBookingTitle: 'Criar Reserva Manual',
  adminManualBookingClient: 'Nome do Cliente',
  adminManualBookingEmail: 'E-mail do Cliente',
  adminManualBookingPhone: 'Telefone',
  adminManualBookingItem: 'Item',
  adminManualBookingDate: 'Data',
  adminManualBookingNotes: 'Observações',
  adminManualBookingCreate: 'Criar Reserva',
  adminManualBookingCreated: 'Reserva manual criada!',
  adminCalendar: 'Calendário',
  adminCalendarTitle: 'Calendário de Operações',
  adminCalendarToday: 'Hoje',

  installTitle: 'Instale o App',
  installSubtitle: 'Acesse rápido, use offline e receba notificações.',
  installFeature1: 'Acesso instantâneo na sua tela inicial',
  installFeature2: 'Funciona mesmo sem internet',
  installFeature3: 'Receba ofertas e novidades',
  installButton: 'Instalar Aplicativo',
  installNotNow: 'Agora não',
  installInstructionsTitle: 'Como instalar',
  installIOSSubtitle: 'No Safari, siga os passos abaixo para adicionar à tela de início:',
  installChromeSubtitle: 'No navegador, siga os passos abaixo:',
  installIOSStep1: 'Toque no botão de compartilhar (ícone com seta para cima)',
  installIOSStep2: 'Role para baixo e selecione "Adicionar à Tela de Início"',
  installIOSStep3: 'Confirme tocando em "Adicionar" no canto superior direito',
  installChromeStep1: 'Toque no menu (três pontinhos) na barra de endereço',
  installChromeStep2: 'Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"',
  installGotIt: 'Entendi!',

  galleryLabel: 'Acervo',
  galleryTitle: 'Galeria',
  gallerySubtitle: 'As melhores imagens das nossas expedições, aulas e vivências na Amazônia Atlântica.',
  galleryAll: 'Todas',
  galleryViewFull: 'Ver Galeria Completa',

  aboutValues: 'Valores Fundamentais',
  aboutValue1Title: 'Segurança',
  aboutValue1Desc: 'Instrutores certificados, equipamentos de última geração e protocolos rigorosos para garantir uma experiência segura em cada atividade.',
  aboutValue2Title: 'Respeito à Natureza',
  aboutValue2Desc: 'Turismo de impacto positivo, preservação ambiental e valorização do ecossistema amazônico em cada experiência que criamos.',
  aboutValue3Title: 'Hospitalidade Amazônica',
  aboutValue3Desc: 'Autenticidade, acolhimento caloroso e conexão genuína com as comunidades locais e a cultura paraense.',

  aboutLeadership: 'Liderança',
  aboutLeader1Name: 'Pingo',
  aboutLeader1Role: 'Diretor Técnico',
  aboutLeader2Name: 'Pablo',
  aboutLeader2Role: 'Diretor de Operações',
  aboutLeader3Name: 'Rafael Conceição',
  aboutLeader3Role: 'Diretor de Experiência e Marca',

  aboutRegions: 'Áreas de Atuação',
  aboutProducts: 'Nossos Produtos',

  chatConversations: 'Conversas',
  chatSearchPlaceholder: 'Buscar riders...',
  chatNoConversations: 'Nenhuma conversa ainda. Busque um rider acima para iniciar!',
  chatStartConvo: 'Iniciar conversa...',
  chatSendMessage: 'Enviar mensagem',
  chatTypeMessage: 'Mensagem...',
  chatOnline: 'Online',
  chatEmpty: 'Inicie a conversa! Envie a primeira mensagem.',
  friendsTitle: 'Amigos',
  friendsList: 'Amigos',
  friendsRequests: 'Pedidos',
  friendsFind: 'Encontrar',
  friendsEmpty: 'Nenhum amigo ainda. Vá para "Encontrar" para adicionar riders!',
  friendsNoRequests: 'Nenhum pedido pendente.',
  friendsSearchPlaceholder: 'Buscar riders por nome...',
  friendsNoResults: 'Nenhum rider encontrado.',
  friendsAdd: 'Adicionar',
  friendsPending: 'Pendente',
  friendsAlreadyFriend: 'Amigo',
  friendsAccept: 'Aceitar',
  friendsReject: 'Rejeitar',
  friendsRemove: 'Remover',
  friendsRequestSent: 'Pedido enviado',
  friendsRequestReceived: 'Pedido recebido',
  notificationsTitle: 'Notificações',
  notificationsMarkAll: 'Marcar tudo como lido',
  notificationsEmpty: 'Nenhuma notificação ainda.',
  navCommunity: 'Comunidade',
  communityTitle: 'Comunidade',
  communityEmpty: 'Nenhuma publicação ainda',
  communityLoginPrompt: 'Faça login para acessar a comunidade',
  homeStartLabel: 'COMECE AQUI',
  homeStartTitle: 'Sua jornada AMZ Wind começa com um clique',
  homeStartSubtitle: 'Explore experiências, encontre trips, conecte-se com a comunidade e acompanhe seu perfil em um único fluxo.',
  homeStartExperiences: 'Experiências',
  homeStartExperiencesDesc: 'Descubra passeios, aulas e expedições em destaque.',
  homeStartTrips: 'Trips',
  homeStartTripsDesc: 'Veja viagens em grupo e participe de programas exclusivos.',
  homeStartCommunity: 'Comunidade',
  homeStartCommunityDesc: 'Compartilhe momentos, interaja e conheça outros riders.',
  homeStartProfile: 'Meu perfil',
  homeStartProfileDesc: 'Acompanhe reservas, viagens e sua presença na comunidade.',
  homeStartLogin: 'Entrar',
  homeStartLoginDesc: 'Crie sua conta e personalize sua jornada AMZ Wind.',
  homeStartGo: 'Abrir',
  shareTitle: 'Compartilhar',
  shareToChat: 'Compartilhar no chat',
  shareConfirm: 'Compartilhar publicação?',
  shareSuccess: 'Compartilhado com sucesso!',
  shareError: 'Erro ao compartilhar',
  postComments: 'comentários',
  postLikes: 'curtidas',
  postShares: 'compartilhamentos',
  feedGlobal: 'Global',
  feedFriends: 'Amigos',
  feedEdited: 'editado',
  feedSaving: 'Salvando...',
  feedSave: 'Salvar',
  feedCancel: 'Cancelar',
  feedConfirmDelete: 'Excluir esta publicação?',
  feedLoading: 'Carregando...',
  feedRetry: 'Tentar novamente',
  feedEmpty: 'Nenhuma publicação ainda',
  feedEmptyHint: 'Seja o primeiro a compartilhar uma session!',
  feedLoadMore: 'Carregar mais',
  feedNoComments: 'Nenhum comentário ainda.',
  feedWriteComment: 'Escreva um comentário...',
  feedSend: 'Enviar',
  feedComment: 'Comentar',
  feedShare: 'Compartilhar',
  navTrips: 'Trips',
  tripsTitle: 'Trips',
  tripsEmpty: 'Nenhuma trip disponível',
  tripsEmptyHint: 'Embreve novas trips serão anunciadas!',
  tripParticipants: 'participantes',
  tripJoined: 'Participando',
  tripJoin: 'Participar',
  tripLeave: 'Sair da Trip',
  tripLeaveConfirm: 'Sair desta viagem?',
  tripFull: 'Lotada',
  tripDetail: 'Viagem',
  tripNotFound: 'Viagem não encontrada',
  tripOrganizedBy: 'Organizado por',
  tripStatusPublished: 'Aberta',
  tripStatusFull: 'Lotada',
  tripStatusCancelled: 'Cancelada',
  tripStatusCompleted: 'Concluída',
  tripStatusDraft: 'Rascunho',
  tripCreate: 'Nova Trip',
  tripCreateButton: 'Criar Trip',
  tripCreateSuccess: 'Trip criada com sucesso!',
  tripEdit: 'Editar Trip',
  tripSave: 'Salvar',
  tripSaving: 'Salvando...',
  tripSaveSuccess: 'Salvo com sucesso!',
  tripUploading: 'Enviando capa...',
  tripCoverLabel: 'Capa',
  tripCoverUpload: 'Selecionar imagem',
  tripCoverTooLarge: 'Imagem muito grande. Limite: 10MB',
  tripTitleLabel: 'Título',
  tripTitlePlaceholder: 'Ex: Downwind Maranhão 2026',
  tripDescriptionLabel: 'Descrição',
  tripDescriptionPlaceholder: 'Descreva a trip...',
  tripDestinationLabel: 'Destino',
  tripDestinationPlaceholder: 'Ex: Maranhão, Brasil',
  tripStartDate: 'Data início',
  tripEndDate: 'Data fim',
  tripDateError: 'Data final deve ser posterior à data inicial',
  tripMaxParticipantsLabel: 'Máx. participantes',
  tripMaxParticipantsPlaceholder: 'Ex: 12',
  tripMaxParticipantsError: 'Mínimo de 2 participantes',
  tripStatusLabel: 'Status',
  tripInvite: 'Convidar',
  tripInviteFriends: 'Convidar Amigos',
  tripInviteButton: 'Convidar',
  tripInvited: 'Convidado',
  tripNoFriendsToInvite: 'Nenhum amigo disponível',
  tripChat: 'Chat',
  tripTabInfo: 'Info',
  tripTabParticipants: 'Pessoas',
  tripTabFeed: 'Feed',
  tripNoParticipants: 'Nenhum participante ainda',
  tripRoleOrganizer: 'Organizador',
  tripRoleParticipant: 'Participante',
  tripPending: 'Pendente',
  tripRemoveConfirm: 'Remover este participante?',
  tripFeedEmpty: 'Nenhum post ainda',
  tripFeedJoinFirst: 'Participe da trip para ver o feed',
  tripVisibilityLabel: 'Visibilidade',
  tripVisibilityPublic: 'Pública — aparece na listagem',
  tripVisibilityPrivate: 'Privada — só participantes veem',

  // FASE 7 — UserProfile
  profileTabProfile: 'Perfil',
  profileTabBookings: 'Minhas Reservas',
  profileTabProducts: 'Produtos',
  profileTabGallery: 'Galeria',
  profileTabTrips: 'Trips',
  profileTabFeed: 'Feed',
  profileTabFriends: 'Amigos',
  profileTabChat: 'Chat',
  profilePersonalData: 'Dados Pessoais',
  profileFullName: 'Nome Completo',
  profileFullNamePlaceholder: 'Seu nome completo',
  profileBio: 'Bio do Atleta',
  profileBioPlaceholder: 'Conte sua história: desde quando pratica kitesurf, seus spots favoritos, conquistas...',
  profileEmail: 'E-mail',
  profilePhone: 'Telefone',
  profilePhonePlaceholder: '(92) 99999-0000',
  profileWhatsApp: 'WhatsApp',
  profileWhatsAppRequired: 'WhatsApp (obrigatório para contato)',
  profileSaving: 'Salvando...',
  profileSave: 'Salvar Perfil',
  profileMemberSince: 'Membro desde:',
  profileBack: 'Voltar',
  profileStatsBookings: 'Reservas',
  profileStatsConfirmed: 'Confirmadas',
  profileStatsProducts: 'Produtos',
  profileStatsReservations: 'reserva(s)',
  profileNoBookings: 'Nenhuma reserva ainda',
  profileNoBookingsHint: 'Suas experiências, aulas e downwinds aparecerão aqui',
  profileProductsPhysical: 'Produtos Físicos',
  profileProductsCount: 'produto(s)',
  profileNoProducts: 'Nenhum produto comprado',
  profileNoProductsHint: 'Lycras, chapéus, acessórios e mais',
  profileGoToShop: 'Ir à Loja',
  profilePurchasedIn: 'Comprado em',
  profileDelivered: 'Produto entregue',
  profilePendingConfirmation: 'Aguardando confirmação',
  profileDeliveryStatus: 'Status da entrega',
  profileSessionsGallery: 'Galeria das Sessions',
  profileSessionsDescription: 'Fotos oficiais tiradas pela equipe da Amazon Wind nas suas sessões. Baixe, comente e conecte-se com outros participantes.',
  profileNoSessions: 'Nenhuma sessão concluída',
  profileNoSessionsHint: 'Complete uma experiência para acessar as fotos da session',
  profileSessionCompleted: 'Concluída',
  profileGallerySoon: 'Galeria será disponibilizada pela equipe em breve',
  profileTripComments: 'Comentários da Trip',
  profileTripCommentsSoon: 'Em breve você poderá comentar e interagir com outros participantes desta sessão!',
  profileMyTrips: 'Minhas Trips',
  profileMyTripsDescription: 'Trips que você organizou ou participa.',
  profileNoTrips: 'Nenhuma trip ainda',
  profileNoTripsHint: 'Crie ou participe de uma trip',
  profileViewTrips: 'Ver Trips',
  profileStatusDraft: 'Rascunho',
  profileStatusPublished: 'Publicada',
  profileStatusFull: 'Lotada',
  profileStatusCancelled: 'Cancelada',
  profileStatusCompleted: 'Concluída',
  profileParticipants: 'participantes',
  profileCommunityFeed: 'Feed da Comunidade',
  profileCommunityFeedDescription: 'Conecte-se com outros riders. Compartilhe suas sessões, fotos e conquistas no kitesurf.',
  profileErrorAvatar: 'Erro ao enviar avatar:',
  profileErrorSave: 'Erro ao salvar:',
  profileSuccessSave: 'Perfil atualizado com sucesso!',
  profileBookingTypeExperience: 'Experiência',
  profileBookingTypeClass: 'Aula',
  profileBookingTypeProduct: 'Produto',

  // FASE 7 — KiteCoursePage
  kiteCourseTitle: 'Aula de Kitesurf Iniciante',
  kiteCourseSubtitle: 'Módulo Iniciante',
  kiteCourseIncludesTitle: 'O que está incluído',
  kiteCourseInclude1: '10 aulas práticas (duração total: 30h)',
  kiteCourseInclude2: 'Equipamento completo incluído (kite, barra, prancha, colete)',
  kiteCourseInclude3: 'Teoria de segurança e meteorologia',
  kiteCourseInclude4: 'Instrutor certificado IKO',
  kiteCourseInclude5: 'Seguro de acidente durante as aulas',
  kiteCourseInclude6: 'Certificado de conclusão do nível Iniciante',
  kiteCourseInclude7: 'Vídeo análise das sessões',
  kiteCourseInclude8: 'Água e lanches durante as aulas',
  kiteCourseModule1Title: 'Módulo 1 — Fundamentos',
  kiteCourseModule1Desc: 'Teoria na praia, montagem do equipamento, primeiros voos com kite na areia, controle básico da barra.',
  kiteCourseModule2Title: 'Módulo 2 — Água',
  kiteCourseModule2Desc: 'Body drag, water start, controle na água, voo assistido pelo instrutor, primeiras manobras.',
  kiteCourseModule3Title: 'Módulo 3 — Independência',
  kiteCourseModule3Desc: 'Manobras básicas autônomas, transição, corte, downwind guiado e análise de vídeo.',
  kiteCourseTotalHours: '30h totais',
  kiteCourseTotalClasses: 'aulas',
  kiteCourseInvestment: 'Investimento',
  kiteCourseInvestmentSummary: '10 aulas completas • Equipamento incluso • Certificação IKO',
  kiteCourseAbout: 'Sobre o Curso',
  kiteCourseAboutText: 'Nosso módulo Iniciante é o programa completo para quem quer aprender kitesurf do zero. Com 10 aulas práticas distribuídas em 3 módulos progressivos, você sai da teoria na praia até realizar suas primeiras manobras de forma independente. Todo o equipamento é fornecido e as aulas são ministradas por instrutores certificados IKO nas melhores condições de vento e água da costa amazônica.',
  kiteCourseWhatIncluded: 'O que está incluído',
  kiteCourseModules: 'Módulos do Curso',
  kiteCourseClasses: 'aulas',
  kiteCourseGallery: 'Galeria',
  kiteCourseSchedule: 'Agendar Aulas',
  kiteCourseScheduleDescription: 'Selecione as datas de início e término das suas aulas. O calendário abaixo ajuda a planejar seu curso.',
  kiteCourseTotalInvestment: 'Total do investimento',
  kiteCourseScheduleButton: 'Agendar e Prosseguir',
  kiteCourseSelectDate: 'Selecione uma data',
  kiteCourseReviews: 'Avaliações',
  kiteCourseReviewsEmpty: 'Avaliações dos alunos aparecerão aqui após conclusão dos cursos.',
  kiteCourseVideoSoon: 'Vídeo em breve',

  // FASE 7 — ExperienceDetail
  expDetailNotFound: 'Experiência não encontrada.',
  expDetailPackage: 'Pacote',
  expDetailIndividual: 'Avulso',
  expDetailFullPackage: 'Pacote Completo',
  expDetailWhatIncluded: 'O que está incluído no pacote',
  expDetailWhatIncludedShort: 'O que está incluído',
  expDetailPackageTotal: 'Investimento total do pacote',
  expDetailPerPerson: 'por pessoa',
  expDetailBookingDate: 'Data da Reserva',
  expDetailAddToCart: 'Adicionar Pacote ao Carrinho',
  expDetailSecurePayment: 'Pagamento seguro via PIX, Cartão ou PayPal',
  expDetailUserFallback: 'User',

  // FASE 7 — AdminDashboard
  adminAccessDenied: 'Acesso restrito a administradores.',
  adminHeroCover: 'Hero / Capa',
  adminTrips: 'Trips',
  adminLoadingDashboard: 'Carregando Painel Administrativo...',
  adminPanel: 'Painel Admin',
  adminThemeLight: 'Modo Claro',
  adminThemeDark: 'Modo Escuro',
  adminCollapse: 'Recolher',
  adminOnline: 'Online',

  // FASE 7 — Feed components
  feedErrorLoading: 'Erro ao carregar feed.',
  feedPostError: 'Erro ao publicar.',
  feedPostTripPlaceholder: 'Postar na trip "${tripName}"...',
  feedPostPlaceholder: 'Compartilhe sua session de kite... 🪁',
  feedPostSuccess: 'Publicado com sucesso!',
  feedPostMedia: 'Foto/Vídeo',
  feedPostSending: 'Enviando mídia...',
  feedPostPublishing: 'Publicando...',
  feedPostButton: 'Publicar',
  feedCommentLoading: 'Carregando...',
  feedCommentEmpty: 'Nenhum comentário ainda.',
  feedCommentPlaceholder: 'Escreva um comentário...',
  feedCommentSend: 'Enviar',
  feedCommentSave: 'Salvar',
  feedCommentCancel: 'Cancelar',
  feedCommentRider: 'Rider',
  feedPostNow: 'agora',
  feedPostEdited: 'editado',
  feedPostDeleteConfirm: 'Excluir esta publicação?',
  feedPostErrorSave: 'Erro ao salvar',
  feedPostSaving: 'Salvando...',
  feedPostSave: 'Salvar',
  feedPostComment: 'Comentar',
  feedPostShare: 'Compartilhar',

  // FASE 7 — Chat components
  chatRiderFallback: 'Rider',
  chatDeletedMessage: 'Mensagem apagada',
  chatMessageFallback: 'Mensagem',
  chatReply: 'Responder',
  chatDelete: 'Apagar',
  chatCancel: 'Cancelar',
  chatMessagePlaceholder: 'Mensagem...',

  // FASE 7 — ConversationsList
  convRiderFallback: 'Rider',
  convYesterday: 'Ontem',
  convTitle: 'Conversas',
  convSearchPlaceholder: 'Buscar riders...',
  convSearching: 'Buscando...',
  convEmpty: 'Nenhuma conversa ainda. Busque um rider acima para iniciar!',
  convStartChat: 'Iniciar conversa...',

  // FASE 7 — Community
  communityLoginButton: 'Entrar',

  // FASE 7 — Notifications
  notificationNow: 'Agora',
  notificationMin: 'min',
  notificationHour: 'h',
  notificationDay: 'd',

  // FASE 7 — Friends
  friendsRiderFallback: 'Rider',

  // FASE 7 — Products
  productNotFound: 'Produto não encontrado.',
  productAddedToCart: 'Adicionado ao carrinho!',
  productInCart: 'no carrinho',
  productContinueShopping: 'Continuar Comprando',
  productViewCart: 'Ver Carrinho',
  productOutOfStock: 'Este produto está esgotado no momento.',
  productViewOthers: 'Ver outros produtos',

  // FASE 7 — Wishlist
  wishlistAlreadyInCart: 'Este item já está no carrinho',
  wishlistAdded: 'adicionado ao carrinho!',
  wishlistRemoved: 'Removido dos favoritos',
  wishlistTitle: 'Lista de Desejos',
  wishlistSubtitle: 'Itens salvos para reserva futura',
  wishlistEmpty: 'Nenhum favorito ainda',
  wishlistEmptyHint: 'Toque no ícone de coração em qualquer experiência ou produto para salvá-lo aqui.',
  wishlistInCart: '✓ No Carrinho',
  wishlistAddToCart: 'Enviar ao Carrinho',
  wishlistRemove: 'Remover',
  wishlistItem: 'item',
  wishlistItems: 'itens',

  // FASE 7 — Trips (error/status)
  tripErrorLoad: 'Erro ao carregar viagem',
  tripErrorJoin: 'Erro ao entrar na viagem',
  tripErrorLeave: 'Erro ao sair da viagem',
  tripErrorInvite: 'Erro ao enviar convite',
  tripErrorRemove: 'Erro ao remover participante',
  tripErrorCreate: 'Erro ao criar viagem',
  tripErrorSave: 'Erro ao salvar',
  tripErrorUpload: 'Falha no upload:',
  tripNotAuthenticated: 'Não autenticado',
  tripStatusPublic: '🌐 Pública',
  tripStatusPrivate: '🔒 Privada',
  tripAgo: 'agora',

  // FASE 7 — ShareDialog
  shareRiderFallback: 'Rider',
  shareGroupFallback: 'Grupo',
  shareTripFallback: 'Trip',
  shareConvFallback: 'Conversa',
  shareSent: 'Enviado!',

  // FASE 7 — FavoriteButton
  favRemoveAria: 'Remover dos favoritos',
  favAddAria: 'Adicionar aos favoritos',

  // FASE 7 — Header
  headerMenu: 'Menu',
  headerAbout: 'Sobre',
  headerToggleTheme: 'Toggle theme',
  headerUserFallback: 'Usuário',
  headerMyProfile: 'Meu Perfil',
  headerAdminPanel: 'Painel Admin',
  headerLogin: 'Entrar',
  headerCart: 'Carrinho',

  // FASE 7 — CartCheckout
  checkoutTestimonial1: 'Experiência incrível! Tudo foi organizado com perfeição. Recomendo demais!',
  checkoutTestimonial2: 'Aula de kite sensacional. Segurança e diversão ao mesmo tempo.',
  checkoutTestimonial3: 'Roteiro de downwind mais lindo que já fiz. Equipe top!',
  checkoutEmpty: 'Explore nossas experiências, produtos e aulas e adicione itens ao carrinho para reservar.',
  checkoutEmptyHint: '',
  checkoutSummary: 'Resumo da Reserva',
  checkoutSubtotal: 'Subtotal',
  checkoutPixDiscount: 'Desconto PIX (5%)',
  checkoutTotal: 'Total',
  checkoutWhatsApp: 'WhatsApp para contato',
  checkoutFilled: '(preenchido)',
  checkoutPaymentMethod: 'Forma de Pagamento',
  checkoutCard: 'Cartão',
  checkoutUpTo: 'Até 6x',
  checkoutInternational: 'Internacional',
  checkoutPixInstant: 'Aprovação Instantânea',
  checkoutPixDiscountApplied: '5% de desconto aplicado',
  checkoutPixKey: 'Chave PIX (Copia e Cola):',
  checkoutPixCopy: 'Copiar Chave PIX',
  checkoutPixCopied: '✓ Copiado!',
  checkoutCardPlaceholder: '0000 0000 0000 0000',
  checkoutCardName: 'Nome no cartão',
  checkoutInstallments: 'Parcelamento',
  checkoutInterestFree: 'sem juros',
  checkoutPaypalTitle: 'PayPal Checkout',
  checkoutPaypalDescription: 'Você será redirecionado para o PayPal para concluir o pagamento de forma segura.',
  checkoutConfirmPayment: 'Confirmar Pagamento',
  checkoutTestimonialsTitle: 'O que nossos clientes dizem',
  checkoutSecurePayment: '100% Seguro',
  checkoutEncryptedPayment: 'Pagamento Criptografado',
  checkoutGuarantee: 'Garantia Amazon Wind',
  checkoutWhatsAppSupport: 'Suporte via WhatsApp',
  checkoutAddItemFirst: 'Adicione um item ao carrinho primeiro',
  checkoutWhatsAppRequired: 'Informe seu WhatsApp para contato.',
  checkoutCreateAccount: 'Criar conta',
  checkoutItemRemoved: 'Item removido do carrinho',

  // FASE 7 — Splash / ProtectedRoute
  splashSubtitle: 'Kitesurf & Expedições',
  protectedRouteLoading: 'Verificando credenciais Amazon Wind...',

  // FASE 7 — Admin components (heroes)
  heroSlideLimit: 'Limite de 6 slides atingido. Exclua um slide antes de criar outro.',
  heroMediaRequired: 'Informe ou envie a mídia de fundo.',
  heroTitleRequired: 'O título é obrigatório.',
  heroSlideUpdated: 'Slide atualizado com sucesso!',
  heroSlideCreated: 'Slide criado com sucesso!',
  heroSlideRemoved: 'Slide oficial removido da visualização.',
  heroSlideDeleted: 'Slide excluído.',
  heroManageTitle: 'Gerenciar Hero / Capa',
  heroManageDescription: 'Controle as mídias e textos de destaque da página inicial.',
  heroSlideCount: 'Limite de 6 slides atingido',
  heroNewSlide: '+ Novo Slide',
  heroDimensionTip: 'Sugestão de dimensões:',
  heroUploadTip: 'Você pode fazer upload de imagem ou vídeo.',
  heroLoading: 'Carregando slides...',
  heroNoSlides: 'Nenhum slide configurado.',
  heroCreateFirst: 'Criar primeiro slide',
  heroTypeYoutube: 'YouTube',
  heroTypeVideo: 'Vídeo',
  heroTypeImage: 'Imagem',
  heroOfficial: 'Oficial',
  heroCtaPrefix: 'CTA:',
  heroMoveUp: 'Mover para cima',
  heroMoveDown: 'Mover para baixo',
  heroEdit: 'Editar',
  heroDelete: 'Excluir',
  heroEditSlide: 'Editar Slide',
  heroNewSlideTitle: 'Novo Slide da Hero',
  heroTitleLabel: 'Título de Destaque',
  heroTitlePlaceholder: 'Ex: Expedições na Costa Norte',
  heroSubtitleLabel: 'Subtítulo',
  heroSubtitlePlaceholder: 'Ex: Sinta a força dos ventos alísios',
  heroMediaTypeLabel: 'Tipo de Mídia',
  heroOrderLabel: 'Ordem',
  heroUploadLabel: 'Fazer Upload do Arquivo',
  heroUrlLabel: 'Ou cole o link direto (URL)',
  heroUrlPlaceholder: 'https://exemplo.com/imagem.jpg ou link do YouTube',
  heroCtaTextLabel: 'Texto do Botão (CTA)',
  heroCtaTextPlaceholder: 'Explorar Roteiros',
  heroCtaLinkLabel: 'Link do Botão',
  heroCancel: 'Cancelar',
  heroSaving: 'Salvando...',
  heroUpdate: 'Atualizar',
  heroCreate: 'Criar Slide',
  heroDeleteTitle: 'Excluir Slide',
  heroDeleteConfirm: 'Tem certeza que deseja excluir "${deleteTarget.title}"?',
  heroDeleteYes: 'Sim, Excluir',

  // FASE 7 — Admin components (bookings)
  bookingUpdated: 'Reserva atualizada com sucesso!',
  bookingDeleted: 'Reserva excluída.',
  bookingTypeExperience: 'Experiência',
  bookingTypeClass: 'Aula',
  bookingTypeProduct: 'Produto',
  bookingConfirmAction: 'Deseja confirmar/cancelar esta reserva?',
  bookingPaid: 'Pagamento confirmado',
  bookingDetails: 'Detalhes da Reserva',
  bookingClientInfo: 'Informações do Cliente',
  bookingFieldName: 'Nome:',
  bookingFieldEmail: 'Email:',
  bookingFieldWhatsApp: 'WhatsApp:',
  bookingFieldPhone: 'Telefone:',
  bookingNoContact: 'Nenhuma informação de contato registrada',
  bookingReservationDetails: 'Detalhes da Reserva',
  bookingFieldType: 'Tipo',
  bookingFieldItemId: 'ID do Item',
  bookingReservedItems: 'Itens Reservados',
  bookingStatusPending: 'Pendente',
  bookingStatusConfirmed: 'Confirmada',
  bookingStatusCancelled: 'Cancelada',
  bookingDate: 'Data da Reserva',
  bookingNotes: 'Notas / Observações',
  bookingCancel: 'Cancelar',
  bookingDelete: 'Excluir',
  bookingSaving: 'Salvando...',
  bookingSave: 'Salvar Alterações',
  bookingDeleteTitle: 'Excluir Reserva',
  bookingDeleteConfirm: 'Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.',

  // FASE 7 — Admin components (classes)
  classErrorLoad: 'Erro ao carregar aulas:',
  classErrorUpdate: 'Erro ao atualizar aula:',
  classUpdated: 'Aula atualizada com sucesso!',
  classErrorCreate: 'Erro ao criar aula:',
  classCreated: 'Aula criada com sucesso!',
  classErrorDelete: 'Erro ao excluir aula:',
  classDeleted: 'Aula excluída.',
  classLoading: 'Carregando aulas...',
  classManageTitle: 'Gerenciar Aulas',
  classManageDescription: 'Configure os pacotes de aulas, mídias e valores.',
  classNewButton: '+ Nova Aula',
  classEmpty: 'Nenhuma aula cadastrada',
  classEdit: 'Editar',
  classDelete: 'Excluir',
  classEditTitle: 'Editar Aula',
  classNewTitle: 'Nova Aula',
  classFieldTitle: 'Título',
  classFieldTitlePlaceholder: 'Ex: Aula Particular de Kite',
  classFieldPrice: 'Preço (R$)',
  classFieldDuration: 'Duração',
  classFieldDurationPlaceholder: 'Ex: 2h30',
  classFieldLevel: 'Nível',
  classFieldLevelPlaceholder: 'Ex: Iniciante / Intermediário',
  classFieldDescription: 'Descrição',
  classFieldImage: 'Imagem Principal da Aula',
  classFieldVideo: 'Vídeo Promocional (Opcional)',
  classCancel: 'Cancelar',
  classSaving: 'Salvando...',
  classUpdate: 'Atualizar',
  classCreate: 'Criar Aula',
  classDeleteTitle: 'Excluir Aula',
  classDeleteConfirm: 'Tem certeza que deseja excluir "${deleteTarget.title}"?',

  // FASE 7 — Admin components (about)
  aboutTitleRequired: 'O título é obrigatório.',
  aboutUpdated: 'Página "Sobre" atualizada!',
  aboutCreated: 'Página "Sobre" criada!',
  aboutManageTitle: 'Gerenciar Página "Sobre"',
  aboutManageDescription: 'Edite o conteúdo da página sobre em cada idioma.',
  aboutEditContent: 'Editar Conteúdo',
  aboutLoading: 'Carregando conteúdo...',
  aboutMainContent: 'Conteúdo Principal',
  aboutFieldTitle: 'Título',
  aboutFieldTitlePlaceholder: 'Ex: Sobre a Amazon Wind',
  aboutFieldSubtitle: 'Subtítulo',
  aboutFieldSubtitlePlaceholder: 'Ex: Escola de Kitesurf & Expedições',
  aboutFieldDescription: 'Descrição',
  aboutFieldDescriptionPlaceholder: 'História completa da empresa...',
  aboutMissionVision: 'Missão & Visão',
  aboutFieldMission: 'Missão',
  aboutFieldMissionPlaceholder: 'Missão da empresa...',
  aboutFieldVision: 'Visão',
  aboutFieldVisionPlaceholder: 'Visão da empresa...',
  aboutMedia: 'Mídia',
  aboutCoverImage: 'Imagem de Capa',
  aboutCoverUrl: 'Ou cole a URL da capa',
  aboutVideoUrl: 'URL do Vídeo (YouTube ou link direto)',
  aboutGallery: 'Galeria',
  aboutGalleryPlaceholder: 'URL da imagem da galeria',
  aboutAddButton: '+ Adicionar',
  aboutCancel: 'Cancelar',
  aboutSaving: 'Salvando...',
  aboutUpdate: 'Atualizar',
  aboutCreate: 'Criar',
  aboutUnsavedData: 'Dados oficiais (não salvos)',
  aboutLabelTitle: 'Título',
  aboutLabelSubtitle: 'Subtítulo',
  aboutLabelDescription: 'Descrição',
  aboutLabelMission: 'Missão',
  aboutLabelVision: 'Visão',
  aboutLabelMedia: 'Mídia',
  aboutLabelCover: 'Capa',
  aboutLabelVideo: 'Vídeo',
  aboutGalleryCount: 'Galeria (${count} imagens)',

  // FASE 7 — Admin components (products)
  productAdminName: 'Produto',
  productAdminPrice: 'Preço',
  productAdminStock: 'Estoque',
  productAdminActions: 'Ações',
  productAdminUnit: ' un.',
  productAdminEdit: 'Editar',
  productAdminDelete: 'Excluir',
  productAdminCategoryPlaceholder: 'Nome da nova categoria',
  productAdminCancel: 'Cancelar',
  productAdminNew: '+ Nova',

  // FASE 7 — Admin components (trips)
  tripAdminStatusUpdated: 'Status atualizado!',
  tripAdminError: 'Erro:',
  tripAdminDeleteConfirm: 'Tem certeza que deseja excluir esta trip?',
  tripAdminDeleted: 'Trip excluída!',
  tripAdminDraft: 'Rascunho',
  tripAdminPublished: 'Publicada',
  tripAdminFull: 'Lotada',
  tripAdminCancelled: 'Cancelada',
  tripAdminCompleted: 'Concluída',
  tripAdminPublic: 'Pública',
  tripAdminPrivate: 'Privada',
  tripAdminAll: 'Todas',
  tripAdminEmpty: 'Nenhuma trip encontrada',
  tripAdminParticipants: ' participantes',

  // FASE 7 — Admin components (shared)
  sharedStatusPending: 'Pendente',
  sharedStatusConfirmed: 'Confirmada',
  sharedStatusCancelled: 'Cancelada',
  sharedUploadError: 'Não foi possível obter a URL do arquivo.',
  sharedUploading: 'Enviando...',
  sharedChooseVideo: 'Escolher vídeo',
  sharedChooseImage: 'Escolher imagem',

  // FASE 7 — Admin components (financial)
  financialStatusPending: 'Pendente',
  financialStatusPaid: 'Pago',
  financialStatusOverdue: 'Atrasado',
  financialTypePayable: 'A Pagar',
  financialTypeReceivable: 'A Receber',
  financialCategoryRent: 'Aluguel',
  financialCategoryEquipment: 'Equipamentos',
  financialCategoryMarketing: 'Marketing',
  financialCategorySalaries: 'Salários',
  financialCategoryServices: 'Serviços',
  financialCategoryOperations: 'Operacional',
  financialCategoryClasses: 'Receita Aulas',
  financialCategoryExpeditions: 'Receita Expedições',
  financialCategoryProducts: 'Receita Produtos',
  financialCategoryOther: 'Outros',
  financialUpdated: 'Conta atualizada!',
  financialCreated: 'Conta criada!',
  financialDeleted: 'Conta excluída.',
  financialSummary: 'Resumo Financeiro',
  financialPay: 'Pagar',
  financialReceive: 'Receber',
  financialBalance: 'Saldo',
  financialFilters: 'Filtros',
  financialAllTypes: 'Todos os Tipos',
  financialAllStatuses: 'Todos os Status',
  financialNewEntry: '+ Nova Conta',
  financialEntries: 'Lançamentos',
  financialItems: ' itens',
  financialEmpty: 'Nenhum lançamento encontrado',
  financialFieldDescription: 'Descrição',
  financialFieldDescriptionPlaceholder: 'Ex: Aluguel espaço, Aula particular...',
  financialFieldType: 'Tipo',
  financialFieldValue: 'Valor (R$)',
  financialFieldDueDate: 'Vencimento',
  financialFieldCategory: 'Categoria',
  financialFieldCategoryPlaceholder: 'Selecione...',
  financialFieldStatus: 'Status',
  financialFieldNotes: 'Observações',
  financialFieldNotesPlaceholder: 'Opcional...',
  financialCancel: 'Cancelar',
  financialSaving: 'Salvando...',
  financialUpdate: 'Atualizar',
  financialCreate: 'Criar Conta',
  financialDeleteTitle: 'Excluir Lançamento',
  financialDeleteConfirm: 'Tem certeza que deseja excluir "${deleteTarget.description}"?',

  // FASE 7 — Admin components (experiences)
  expAdminPackage: 'Pacote',
  expAdminIndividual: 'Avulso',
  expAdminItemsIncluded: ' itens inclusos',
  expAdminTypeLabel: 'Tipo de Experiência',
  expAdminTypeIndividual: 'Experiência Individual',
  expAdminTypeIndividualDesc: 'Aula avulsa, downwind, etc.',
  expAdminTypePackage: 'Pacote Completo',
  expAdminTypePackageDesc: 'All-Inclusive, curso, etc.',
  expAdminCategoryPlaceholder: 'Nome da nova categoria',
  expAdminCancel: 'Cancelar',
  expAdminNew: '+ Nova',
  expAdminOriginalPrice: 'Preço Original (de referência, opcional)',
  expAdminOriginalPricePlaceholder: 'Ex: 14500.00 (mostra desconto)',
  expAdminOriginalPriceHelp: 'Se preenchido, mostra o preço riscado e o percentual de desconto.',
  expAdminIncludedItems: 'O que está incluído (1 item por linha)',
  expAdminIncludedPlaceholder: '10 aulas práticas (30h)\nEquipamento completo\nCertificação IKO\nSeguro de acidente\nÁgua e lanches',
  expAdminIncludedHelp: 'Separe cada item por linha...',

  // FASE 7 — Experiencias (landing section)
  expLandingDiscover: 'Descubra',
  expLandingTitle: 'Experiências & Downwinds',
  expLandingDescription: 'Rotas exclusivas pela Amazônia Atlântica. Cada trajeto é uma nova aventura.',
  expLandingDetails: 'Ver Detalhes →',

  // FASE 7 — KiteSchool component
  kiteSchoolAlt: 'Aula de kitesurf',

  // FASE 7 — ContactNewsletter
  contactSendAnother: 'Enviar outra mensagem',

  // FASE 7 — Servicos
  svcWhatsAppRequired: 'Informe o número de WhatsApp para contato.',
  svcDepartureAfterArrival: 'Saída deve ser posterior a Chegada',

  // FASE 7 — Footer
  footerWhatsApp: 'WhatsApp',

  // FASE 7 — InstallAppBanner
  bannerClose: 'Fechar',

  // Accessibility aria-labels
  ariaAttach: 'Anexar arquivo',
  ariaLike: 'Curtir',
  ariaUnlike: 'Descurtir',

  // Admin — Hero (additional keys)
  heroManageSubtitle: 'Controle as mídias e textos de destaque da página inicial.',
  heroDimensionHelp: 'Você pode fazer upload de arquivo, colar um link direto (URL) de imagem/vídeo, ou colar um link do YouTube — o tipo de mídia será detectado automaticamente.',
  heroEmpty: 'Nenhum slide configurado.',
  heroBadgeYouTube: 'YouTube',
  heroBadgeVideo: 'Vídeo',
  heroBadgeImage: 'Imagem',
  heroBadgeOfficial: 'Oficial',
  heroCTA: 'CTA: ',
  heroHighlightTitle: 'Título de Destaque',
  heroHighlightPlaceholder: 'Ex: Expedições na Costa Norte',
  heroMediaType: 'Tipo de Mídia',
  heroOrder: 'Ordem',
  heroUploadFile: 'Fazer Upload do Arquivo',
  heroOrPasteUrl: 'Ou cole o link direto (URL)',
  heroButtonText: 'Texto do Botão',
  heroButtonLink: 'Link do Botão',
  heroSaveSlide: 'Criar Slide',
  heroLimitReached: 'Limite de 6 slides atingido. Exclua um slide antes de criar outro.',
  heroOfficialRemoved: 'Slide oficial removido da visualização.',

  // Admin — Financial (additional keys)
  finPending: 'Pendente',
  finPaid: 'Pago',
  finOverdue: 'Atrasado',
  finPayable: 'A Pagar',
  finReceivable: 'A Receber',
  finAccountUpdated: 'Conta atualizada!',
  finAccountCreated: 'Conta criada!',
  finAccountDeleted: 'Conta excluída.',
  finSummary: 'Resumo Financeiro',
  finToPay: 'Pagar',
  finToReceive: 'Receber',
  finBalance: 'Saldo',
  finReceived: 'Recebido',
  finFilters: 'Filtros',
  finAllTypes: 'Todos os Tipos',
  finAllStatuses: 'Todos os Status',
  finNewAccount: '+ Nova Conta',
  finTransactions: 'Lançamentos',
  finItems: ' itens',
  finLoading: 'Carregando...',
  finEmpty: 'Nenhum lançamento encontrado',
  finDescription: 'Descrição',
  finType: 'Tipo',
  finCategory: 'Categoria',
  finAmount: 'Valor',
  finDueDate: 'Vencimento',
  finStatus: 'Status',
  finActions: 'Ações',
  finEdit: 'Editar',
  finDelete: 'Excluir',
  finEditAccount: 'Editar Conta',
  finNewAccountTitle: 'Nova Conta',
  finFormType: 'Tipo',
  finFormDescription: 'Descrição',
  finFormDescriptionPlaceholder: 'Ex: Aluguel espaço, Aula particular...',
  finFormAmount: 'Valor (R$)',
  finFormDueDate: 'Vencimento',
  finFormCategory: 'Categoria',
  finFormSelect: 'Selecione...',
  finFormStatus: 'Status',
  finFormNotes: 'Observações',
  finFormNotesPlaceholder: 'Opcional...',
  finFormCancel: 'Cancelar',
  finFormSaving: 'Salvando...',
  finFormCreate: 'Criar Conta',
  finDeleteTitle: 'Excluir Lançamento',
  finDeleteConfirm: 'Tem certeza que deseja excluir',
  finCategoryRent: 'Aluguel',
  finCategoryEquipment: 'Equipamentos',
  finCategoryMarketing: 'Marketing',
  finCategorySalaries: 'Salários',
  finCategoryServices: 'Serviços',
  finCategoryOperational: 'Operacional',
  finCategoryClassRevenue: 'Receita Aulas',
  finCategoryExpeditionRevenue: 'Receita Expedições',
  finCategoryProductRevenue: 'Receita Produtos',
  finCategoryOther: 'Outros',

  // Admin — Trips (additional keys)
  tripsAll: 'Todas',
  tripsParticipants: ' participantes',
  tripsDraft: 'Rascunho',
  tripsPublished: 'Publicada',
  tripsFull: 'Lotada',
  tripsCancelled: 'Cancelada',
  tripsCompleted: 'Concluída',
  tripsPublic: 'Pública',
  tripsPrivate: 'Privada',
  tripsStatusUpdated: 'Status atualizado!',
  tripsDeleteTitle: 'Excluir',
  tripsDeleted: 'Trip excluída!',

  // Admin — Classes (additional keys)
  classesTitle: 'Gerenciar Aulas',
  classesSubtitle: 'Configure os pacotes de aulas, mídias e valores.',
  classesNew: '+ Nova Aula',
  classesEmpty: 'Nenhuma aula cadastrada',
  classesEdit: 'Editar',
  classesDelete: 'Excluir',
  classesEditTitle: 'Editar Aula',
  classesNewTitle: 'Nova Aula',
  classesFormTitle: 'Título',
  classesFormTitlePlaceholder: 'Ex: Aula Particular de Kite',
  classesFormPrice: 'Preço (R$)',
  classesFormDuration: 'Duração',
  classesFormDurationPlaceholder: 'Ex: 2h30',
  classesFormLevel: 'Nível',
  classesFormLevelPlaceholder: 'Ex: Iniciante / Intermediário',
  classesFormDescription: 'Descrição',
  classesFormImage: 'Imagem Principal da Aula',
  classesFormVideo: 'Video Promocional (Opcional)',
  classesCancel: 'Cancelar',
  classesSaving: 'Salvando...',
  classesUpdate: 'Atualizar',
  classesCreate: 'Criar Aula',
  classesDeleteTitle: 'Excluir Aula',
  classesDeleteConfirm: 'Tem certeza que deseja excluir',
  classesUpdated: 'Aula atualizada com sucesso!',
  classesCreated: 'Aula criada com sucesso!',
  classesDeleted: 'Aula excluída.',
  classesLoadError: 'Erro ao carregar aulas',
  classesUpdateError: 'Erro ao atualizar aula',
  classesCreateError: 'Erro ao criar aula',
  classesDeleteError: 'Erro ao excluir aula',
  classesLoading: 'Carregando aulas...',

  // Admin — About (additional keys)
  aboutTitleLabel: 'Título',
  aboutSubtitleLabel: 'Subtítulo',
  aboutSubtitlePlaceholder: 'Ex: Escola de Kitesurf & Expedições',
  aboutDescription: 'Descrição',
  aboutDescriptionPlaceholder: 'História completa da empresa...',
  aboutMissionPlaceholder: 'Missão da empresa...',
  aboutVisionPlaceholder: 'Visão da empresa...',
  aboutGalleryAlt: 'Galeria ',
  aboutAdd: '+ Adicionar',
  aboutUnsaved: 'Dados oficiais (não salvos)',

  // Admin — Products (additional keys)
  prodProduct: 'Produto',
  prodPrice: 'Preço',
  prodStock: 'Estoque',
  prodActions: 'Ações',
  prodUnit: ' un.',
  prodEdit: 'Editar',
  prodDelete: 'Excluir',
  prodNewCategory: 'Nome da nova categoria',
  prodCancel: 'Cancelar',
  prodNew: '+ Nova',

  // Admin — Experiences (additional keys)
  expTypePackage: 'Pacote',
  expTypeIndividual: 'Avulso',
  expItemsIncluded: ' itens inclusos',
  expTypeLabel: 'Tipo de Experiência',
  expTypeIndividualBtn: 'Experiência Individual',
  expTypeIndividualDesc: 'Aula avulsa, downwind, etc.',
  expTypePackageBtn: 'Pacote Completo',
  expTypePackageDesc: 'All-Inclusive, curso, etc.',
  expNewCategory: 'Nome da nova categoria',
  expCancel: 'Cancelar',
  expNew: '+ Nova',
  expOriginalPrice: 'Preço Original (de referência, opcional)',
  expOriginalPriceHelp: 'Se preenchido, mostra o preço riscado e o percentual de desconto.',
  expIncludes: 'O que está incluído (1 item por linha)',
  expIncludesHelp: 'Separe cada item por linha. Esses itens aparecerão na página de detalhes da experiência.',

  // Admin — Bookings (additional keys)
  bookingGuest: 'Guest',
  bookingPaymentConfirmed: 'Pagamento confirmado',
  bookingName: 'Nome:',
  bookingEmail: 'Email:',
  bookingWhatsApp: 'WhatsApp:',
  bookingPhone: 'Telefone:',
  bookingStatusLabel: 'Status',
  bookingDateLabel: 'Data da Reserva',

  // Admin — Shared (additional keys)
  sharedPending: 'Pendente',
  sharedConfirmed: 'Confirmada',
  sharedCancelled: 'Cancelada',
  sharedSending: 'Enviando...',

  // Admin — Reviews (additional keys)
  reviewUser: 'User',
  reviewDeleted: 'Review deleted',
}

const en: TranslationKeys = {
  navExperiencias: 'Experiences',
  navEscola: 'School',
  navServicos: 'Services',
  navContato: 'Contact',

  heroTagline: 'Expeditions · Downwinds · Experiences in the Atlantic Amazon',
  heroTitle1: 'The Amazon is our',
  heroTitleHighlight: 'starting point',
  heroSubtitle: 'We don\'t just want to organize trips. We want to reveal a territory.',
  heroCTA1: 'See Experiences',
  heroCTA2: 'Book a Lesson',

  expLabel: 'Discover',
  expTitle: 'Experiences & Downwinds',
  expSubtitle: 'Exclusive routes through the Atlantic Amazon. Every journey is a new adventure.',

  exp1Title: 'Ajuruteua → Salinas',
  exp1Desc: 'Navigate through wild beaches and crystal-clear waters of Pará. Constant wind and perfect waves for an unforgettable downwind.',
  exp2Title: 'Salinas → Algodoal',
  exp2Desc: 'Complete expedition between paradise islands. Stop for diving and observing the Amazonian fauna.',
  exp3Title: 'Scarlet Ibis Flight',
  exp3Desc: 'Follow the flight of the scarlet ibis at sunset. A magical experience of contemplation and nature.',
  exp4Title: 'Carimbó on the Beach',
  exp4Desc: 'Carimbó circle with local masters to the sound of the sea. Immersion in Amazonian culture and rhythm.',

  badgeDownwind: 'Downwind',
  badgeExpedition: 'Expedition',
  badgeCultural: 'Cultural Experience',
  levelIntermediate: 'Intermediate',
  levelIntermediateAdv: 'Intermediate/Advanced',
  levelAll: 'All levels',

  ksLabel: 'Learn',
  ksTitle: 'KiteSchool',
  ksSubtitle: 'Private and group lessons with certified instructors. From your first flight to independence.',
  ksMostPopular: 'Most Popular',
  ksSchedule: 'Book a Lesson',
  ksBasic: 'Basic',
  ksBasicIncludes: ['Beach theory', 'Equipment setup', 'First flights on sand', 'Individual supervision'],
  ksBeginner: 'Beginner',
  ksBeginnerIncludes: ['Safety review', 'Water control', 'Assisted flight', 'Basic maneuver practice'],
  ksSpecific: 'Specific',
  ksSpecificIncludes: ['Advanced technique', 'Guided downwind', 'Cut and transition', 'Video analysis'],

  svcLabel: 'Extras',
  svcTitle: 'Services & Products',
  svcSubtitle: 'Everything you need for your Amazonian experience, all in one place.',
  svc1Title: 'UV Shirts',
  svc1Desc: 'Solar protection with Amazon Wind design. Technical quick-dry fabric.',
  svc1Price: 'From R$ 89',
  svc2Title: 'Caps',
  svc2Desc: 'Caps with embroidered brims. Ideal for the Amazonian winds.',
  svc2Price: 'From R$ 59',
  svc3Title: 'Transfer',
  svc3Desc: 'Relocation and transfer between beaches. Vehicles adapted for sand.',
  svc3Price: 'Upon request',
  svc4Title: 'Accommodation',
  svc4Desc: 'Partnership with inns and residences in Salinópolis and Ajuruteua.',
  svc4Price: 'Upon request',
  svcBook: 'Book',
  svcBookTitle: 'Book Service',
  svcBookSuccess: 'Request sent successfully! We will get in touch.',
  svcDateLabel: 'Preferred date',
  svcSchedule: 'Book now',
  svcRequired: 'Required fields',
  svcServiceLabel: 'Service',

  footerAbout: 'Kitesurf School and Expeditions in the Atlantic Amazon. Founded by Pingo, Pablo and Rafael.',
  footerContact: 'Contact',
  footerLocation: 'Location',
  footerRights: 'All rights reserved.',

  // ═══ ADMIN ═══
  adminDashboard: 'Dashboard',
  adminExperiences: 'Experiences',
  adminProducts: 'Products',
  adminClasses: 'Classes',
  adminBookings: 'Bookings',
  adminSettings: 'Settings',
  adminLogout: 'Logout',
  adminBackToSite: 'Back to Site',

  adminOverview: 'Overview',
  adminTotalExperiences: 'Total Experiences',
  adminTotalProducts: 'Total Products',
  adminTotalBookings: 'Total Bookings',
  adminPendingBookings: 'Pending',
  adminConfirmedBookings: 'Confirmed',
  adminRevenue: 'Revenue',
  adminConnected: 'Connected',
  adminRecentBookings: 'Recent Bookings',
  adminNoBookings: 'No bookings yet',
  adminQuickActions: 'Quick Actions',

  adminExpTitle: 'Experiences & Downwinds',
  adminExpSubtitle: 'Manage routes, expeditions and cultural experiences',
  adminNewExperience: 'New Experience',
  adminEditExperience: 'Edit Experience',
  adminExpFormTitle: 'Title',
  adminExpFormDescription: 'Description',
  adminExpFormCategory: 'Category',
  adminExpFormNewCategory: 'New Category',
  adminExpFormSelectCategory: 'Select a category',
  adminExpFormPrice: 'Price (R$)',
  adminExpFormDuration: 'Duration',
  adminExpFormLevel: 'Level',
  adminExpFormCommunity: 'Community',
  adminExpFormImageUrl: 'Image URL',
  adminExpFormVideoUrl: 'Video URL',
  adminExpFormFeatured: 'Featured on homepage',
  adminExpFormCreate: 'Create Experience',
  adminExpFormUpdate: 'Update',
  adminExpDeleteConfirm: 'Are you sure you want to delete this experience?',
  adminExpCreated: 'Experience created successfully!',
  adminExpUpdated: 'Experience updated!',
  adminExpDeleted: 'Experience deleted.',
  adminExpNoData: 'No experiences registered',
  adminLevels: ['Beginner', 'Intermediate', 'Advanced', 'All levels'],

  adminProdTitle: 'Products & E-commerce',
  adminProdSubtitle: 'Manage stock, prices and product categories',
  adminNewProduct: 'New Product',
  adminEditProduct: 'Edit Product',
  adminProdFormTitle: 'Product Name',
  adminProdFormDescription: 'Description',
  adminProdFormPrice: 'Price (R$)',
  adminProdFormStock: 'Stock',
  adminProdFormCategory: 'Category',
  adminProdFormImage: 'Image URL',
  adminProdFormCreate: 'Create Product',
  adminProdFormUpdate: 'Update',
  adminProdDeleteConfirm: 'Are you sure you want to delete this product?',
  adminProdCreated: 'Product created successfully!',
  adminProdUpdated: 'Product updated!',
  adminProdDeleted: 'Product deleted.',
  adminProdNoData: 'No products registered',
  adminProdCategories: ['Clothing', 'Equipment', 'Accessory', 'Consumable'],

  adminClassTitle: 'Classes & KiteSchool',
  adminClassSubtitle: 'Manage class packages, instructors and schedules',
  adminNewClass: 'New Class',
  adminEditClass: 'Edit Class',
  adminClassFormTitle: 'Class Name',
  adminClassFormDescription: 'Description',
  adminClassFormPrice: 'Price (R$)',
  adminClassFormDuration: 'Duration',
  adminClassFormLevel: 'Level',
  adminClassFormInstructor: 'Instructor',
  adminClassFormCreate: 'Create Class',
  adminClassFormUpdate: 'Update',
  adminClassDeleteConfirm: 'Are you sure you want to delete this class?',
  adminClassCreated: 'Class created successfully!',
  adminClassUpdated: 'Class updated!',
  adminClassDeleted: 'Class deleted.',
  adminClassNoData: 'No classes registered',

  adminBookTitle: 'Bookings & Schedule',
  adminBookSubtitle: 'View and manage all bookings',
  adminBookFilterAll: 'All',
  adminBookFilterPending: 'Pending',
  adminBookFilterConfirmed: 'Confirmed',
  adminBookFilterCancelled: 'Cancelled',
  adminBookConfirm: 'Confirm',
  adminBookCancel: 'Cancel',
  adminBookConfirmed: 'Booking confirmed!',
  adminBookCancelled: 'Booking cancelled.',
  adminBookNoData: 'No bookings found',
  adminBookClient: 'Client',
  adminBookDate: 'Date',
  adminBookType: 'Type',
  adminBookStatus: 'Status',
  adminBookActions: 'Actions',

  // Financial Manager
  adminFinancial: 'Financial',
  adminAbout: 'About',
  adminFinPayable: 'Payable',
  adminFinReceivable: 'Receivable',
  adminFinPending: 'Pending',
  adminFinPaid: 'Paid',
  adminFinOverdue: 'Overdue',
  adminFinNewAccount: 'New Account',
  adminFinEditAccount: 'Edit Account',
  adminFinDescription: 'Description',
  adminFinAmount: 'Amount',
  adminFinDueDate: 'Due Date',
  adminFinCategory: 'Category',
  adminFinNotes: 'Notes',
  adminFinSave: 'Save',
  adminFinDeleteConfirm: 'Are you sure you want to delete this account?',

  // About Page
  aboutTitle: 'About Amazon Wind',
  aboutSubtitle: 'Kitesurf School & Expeditions in the Amazon',
  aboutMission: 'Mission',
  aboutVision: 'Vision',

  // Reviews
  adminReviews: 'Reviews',
  reviewsTitle: 'Reviews & Comments',
  reviewsAverage: 'Average',
  reviewsTotal: 'reviews',
  reviewsWrite: 'Write a review',
  reviewsLoginToComment: 'Log in to comment',
  reviewsSubmit: 'Submit review',
  reviewsPendingNotice: 'Your comment will be moderated before being published.',
  reviewsNoReviews: 'No reviews yet. Be the first!',
  reviewsReply: 'Reply',
  reviewsReplyTo: 'Reply to',
  reviewsCancel: 'Cancel',
  reviewsRating: 'Your rating',
  reviewsComment: 'Your comment',
  reviewsSelectRating: 'Select a rating',
  reviewsPending: 'Pending',
  reviewsApproved: 'Approved',
  reviewsRejected: 'Rejected',
  reviewsApprove: 'Approve',
  reviewsReject: 'Reject',
  reviewsDelete: 'Delete',
  reviewsConfirmDelete: 'Are you sure you want to delete this review?',
  reviewsAdminTitle: 'Manage Reviews',
  reviewsAdminPending: 'Pending',
  reviewsAdminAll: 'All',

  favorites: 'Favorites',

  cartTitle: 'Cart',
  cartEmpty: 'Your cart is empty',
  cartAddExperience: 'Add Experience',
  cartAddProduct: 'Add Product',
  cartAddClass: 'Add Class',
  cartTripDates: 'Trip Dates',
  cartCheckIn: 'Arrival',
  cartCheckOut: 'Departure',
  cartNights: 'Nights',
  cartBasePrice: 'Base Price / Night',
  cartSubtotal: 'Subtotal',
  cartTotal: 'Total',
  cartCheckout: 'Complete Booking',
  cartRemove: 'Remove',
  cartDays: 'days',
  cartPerNight: 'per night',
  cartSelectDates: 'Select trip dates',
  cartSummary: 'Summary',
  cartAccommodation: 'Accommodation',
  cartItemCount: 'items in cart',
  cartMyBookings: 'My Bookings',
  navHome: 'Home',
  navProfile: 'Profile',
  checkoutContactInfo: 'Contact Information',
  checkoutName: 'Name',
  checkoutEmail: 'Email',
  checkoutPhone: 'Phone',
  checkoutMessage: 'Message',
  checkoutNameRequired: 'Please enter your name.',
  checkoutEmailRequired: 'Please enter your email.',
  checkoutEmailInvalid: 'Invalid email address.',
  checkoutError: 'Error creating booking(s).',
  checkoutSuccess: 'Booking confirmed!',
  checkoutSuccessDetail: 'You will receive a confirmation email shortly. Track your bookings in the dashboard.',
  checkoutProcessing: 'Processing...',
  checkoutLoginTitle: 'Sign in to continue',
  checkoutLoginSubtitle: 'Access your account to complete your booking',
  checkoutLoginGoogle: 'Sign in with Google',
  checkoutLoginDivider: 'or',
  checkoutLoginEmail: 'Email',
  checkoutLoginPassword: 'Password',
  checkoutLoginButton: 'Sign in',
  checkoutLoginForgot: 'Forgot password?',
  checkoutLoginNoAccount: "Don't have an account?",
  checkoutLoggedInAs: 'Signed in as',
  checkoutGuest: 'Continue as guest',
  loginLoading: 'Loading...',
  loginSubtitle: 'Access your account',
  loginEmail: 'Email',
  loginPassword: 'Password',
  loginButton: 'Sign in',
  loginAuthenticating: 'Authenticating...',
  loginBack: '← Back to main site',

  adminSave: 'Save',
  adminCancel: 'Cancel',
  adminDelete: 'Delete',
  adminEdit: 'Edit',
  adminCreate: 'Create',
  adminLoading: 'Loading...',
  adminError: 'Error',
  adminSuccess: 'Success',
  adminSearch: 'Search...',
  adminNoResults: 'No results found',
  adminConfirm: 'Confirm',
  adminBack: 'Back',
  adminNext: 'Next',
  adminOf: 'of',

  navLogin: 'Login',
  navAdmin: 'Admin',
  navMinhaConta: 'My Account',

  contactTitle: 'Contact Us',
  contactSubtitle: 'Questions? Send us a message.',
  contactName: 'Name',
  contactEmail: 'Email',
  contactPhone: 'Phone',
  contactMessage: 'Message',
  contactSend: 'Send Message',
  contactSuccess: 'Message sent successfully!',
  newsletterTitle: 'Stay Updated',
  newsletterSubtitle: 'Get news, promotions and kitesurf tips.',
  newsletterPlaceholder: 'Your best email',
  newsletterButton: 'Subscribe',
  newsletterSuccess: 'Successfully subscribed!',
  newsletterAlready: 'This email is already registered.',

  expDetailBook: 'Book Now',
  expDetailDuration: 'Duration',
  expDetailLevel: 'Level',
  expDetailCommunity: 'Community',
  expDetailIncludes: 'What\'s included',
  expDetailRelated: 'Related Experiences',
  expDetailReviews: 'Reviews',
  expDetailNoReviews: 'No reviews yet. Be the first!',
  expDetailAddReview: 'Leave a Review',
  expDetailReviewName: 'Your name',
  expDetailReviewText: 'Your review',
  expDetailReviewSubmit: 'Submit Review',

  prodCategoryTitle: 'Products',
  prodCategoryAll: 'All',
  prodDetailAddToCart: 'Add to Cart',
  prodDetailInStock: 'In stock',
  prodDetailOutOfStock: 'Out of stock',
  prodDetailRelated: 'Related Products',
  prodDetailDescription: 'Description',

  customerTitle: 'My Account',
  customerSubtitle: 'Manage your bookings and personal info',
  customerBookings: 'My Bookings',
  customerNoBookings: 'You have no bookings yet.',
  customerProfile: 'Profile',
  customerName: 'Full Name',
  customerPhone: 'Phone',
  customerSave: 'Save Changes',
  customerSaved: 'Profile updated!',
  customerError: 'Error saving. Please try again.',
  customerCancelBooking: 'Cancel',
  customerCancelConfirm: 'Are you sure you want to cancel this booking?',
  customerCancelled: 'Booking cancelled.',
  customerBookingDate: 'Date',
  customerBookingType: 'Type',
  customerBookingStatus: 'Status',
  customerBookingNotes: 'Notes',
  customerStatsTotal: 'Total',
  customerStatsConfirmed: 'Confirmed',
  customerStatsPending: 'Pending',
  customerStatusPending: 'Pending',
  customerStatusConfirmed: 'Confirmed',
  customerStatusCancelled: 'Cancelled',
  customerTypeExperience: 'Experience',
  customerTypeClass: 'Class',
  customerTypeProduct: 'Product',
  customerJoinDate: 'Member since',
  customerEmail: 'Email',

  adminManualBooking: 'Manual Booking',
  adminManualBookingTitle: 'Create Manual Booking',
  adminManualBookingClient: 'Client Name',
  adminManualBookingEmail: 'Client Email',
  adminManualBookingPhone: 'Phone',
  adminManualBookingItem: 'Item',
  adminManualBookingDate: 'Date',
  adminManualBookingNotes: 'Notes',
  adminManualBookingCreate: 'Create Booking',
  adminManualBookingCreated: 'Manual booking created!',
  adminCalendar: 'Calendar',
  adminCalendarTitle: 'Operations Calendar',
  adminCalendarToday: 'Today',

  installTitle: 'Install the App',
  installSubtitle: 'Quick access, offline use and push notifications.',
  installFeature1: 'Instant access from your home screen',
  installFeature2: 'Works even without internet',
  installFeature3: 'Receive offers and news',
  installButton: 'Install App',
  installNotNow: 'Not now',
  installInstructionsTitle: 'How to install',
  installIOSSubtitle: 'In Safari, follow the steps below to add to your home screen:',
  installChromeSubtitle: 'In your browser, follow the steps below:',
  installIOSStep1: 'Tap the share button (icon with an upward arrow)',
  installIOSStep2: 'Scroll down and select "Add to Home Screen"',
  installIOSStep3: 'Confirm by tapping "Add" in the top right corner',
  installChromeStep1: 'Tap the menu (three dots) in the address bar',
  installChromeStep2: 'Select "Install app" or "Add to home screen"',
  installGotIt: 'Got it!',

  galleryLabel: 'Portfolio',
  galleryTitle: 'Gallery',
  gallerySubtitle: 'The best images from our expeditions, lessons and experiences in the Atlantic Amazon.',
  galleryAll: 'All',
  galleryViewFull: 'View Full Gallery',

  aboutValues: 'Core Values',
  aboutValue1Title: 'Safety',
  aboutValue1Desc: 'Certified instructors, state-of-the-art equipment and rigorous protocols to ensure a safe experience in every activity.',
  aboutValue2Title: 'Respect for Nature',
  aboutValue2Desc: 'Positive impact tourism, environmental preservation and appreciation of the Amazonian ecosystem in every experience we create.',
  aboutValue3Title: 'Amazonian Hospitality',
  aboutValue3Desc: 'Authenticity, warm welcome and genuine connection with local communities and Pará culture.',

  aboutLeadership: 'Leadership',
  aboutLeader1Name: 'Pingo',
  aboutLeader1Role: 'Technical Director',
  aboutLeader2Name: 'Pablo',
  aboutLeader2Role: 'Operations Director',
  aboutLeader3Name: 'Rafael Conceição',
  aboutLeader3Role: 'Experience & Brand Director',

  aboutRegions: 'Areas of Operation',
  aboutProducts: 'Our Products',

  chatConversations: 'Conversations',
  chatSearchPlaceholder: 'Search riders...',
  chatNoConversations: 'No conversations yet. Search for a rider above to start!',
  chatStartConvo: 'Start conversation...',
  chatSendMessage: 'Send message',
  chatTypeMessage: 'Message...',
  chatOnline: 'Online',
  chatEmpty: 'Start the conversation! Send the first message.',
  friendsTitle: 'Friends',
  friendsList: 'Friends',
  friendsRequests: 'Requests',
  friendsFind: 'Find',
  friendsEmpty: 'No friends yet. Go to "Find" to add riders!',
  friendsNoRequests: 'No pending requests.',
  friendsSearchPlaceholder: 'Search riders by name...',
  friendsNoResults: 'No riders found.',
  friendsAdd: 'Add',
  friendsPending: 'Pending',
  friendsAlreadyFriend: 'Friend',
  friendsAccept: 'Accept',
  friendsReject: 'Reject',
  friendsRemove: 'Remove',
  friendsRequestSent: 'Request sent',
  friendsRequestReceived: 'Request received',
  notificationsTitle: 'Notifications',
  notificationsMarkAll: 'Mark all as read',
  notificationsEmpty: 'No notifications yet.',
  navCommunity: 'Community',
  communityTitle: 'Community',
  communityEmpty: 'No posts yet',
  communityLoginPrompt: 'Log in to access the community',
  homeStartLabel: 'START HERE',
  homeStartTitle: 'Your AMZ Wind journey starts with one click',
  homeStartSubtitle: 'Explore experiences, join trips, connect with the community and track your profile in one clear flow.',
  homeStartExperiences: 'Experiences',
  homeStartExperiencesDesc: 'Discover expeditions, lessons and featured adventures.',
  homeStartTrips: 'Trips',
  homeStartTripsDesc: 'Browse group trips and join trips designed for the rider community.',
  homeStartCommunity: 'Community',
  homeStartCommunityDesc: 'Share moments, follow conversations and meet other riders.',
  homeStartProfile: 'My profile',
  homeStartProfileDesc: 'Track your bookings, trips and your place in the community.',
  homeStartLogin: 'Log in',
  homeStartLoginDesc: 'Create your account and personalize your AMZ Wind journey.',
  homeStartGo: 'Open',
  shareTitle: 'Share',
  shareToChat: 'Share to chat',
  shareConfirm: 'Share this post?',
  shareSuccess: 'Shared successfully!',
  shareError: 'Error sharing',
  postComments: 'comments',
  postLikes: 'likes',
  postShares: 'shares',
  feedGlobal: 'Global',
  feedFriends: 'Friends',
  feedEdited: 'edited',
  feedSaving: 'Saving...',
  feedSave: 'Save',
  feedCancel: 'Cancel',
  feedConfirmDelete: 'Delete this post?',
  feedLoading: 'Loading...',
  feedRetry: 'Try again',
  feedEmpty: 'No posts yet',
  feedEmptyHint: 'Be the first to share a session!',
  feedLoadMore: 'Load more',
  feedNoComments: 'No comments yet.',
  feedWriteComment: 'Write a comment...',
  feedSend: 'Send',
  feedComment: 'Comment',
  feedShare: 'Share',
  navTrips: 'Trips',
  tripsTitle: 'Trips',
  tripsEmpty: 'No trips available',
  tripsEmptyHint: 'New trips will be announced soon!',
  tripParticipants: 'participants',
  tripJoined: 'Joined',
  tripJoin: 'Join',
  tripLeave: 'Leave Trip',
  tripLeaveConfirm: 'Leave this trip?',
  tripFull: 'Full',
  tripDetail: 'Trip',
  tripNotFound: 'Trip not found',
  tripOrganizedBy: 'Organized by',
  tripStatusPublished: 'Open',
  tripStatusFull: 'Full',
  tripStatusCancelled: 'Cancelled',
  tripStatusCompleted: 'Completed',
  tripStatusDraft: 'Draft',
  tripCreate: 'New Trip',
  tripCreateButton: 'Create Trip',
  tripCreateSuccess: 'Trip created successfully!',
  tripEdit: 'Edit Trip',
  tripSave: 'Save',
  tripSaving: 'Saving...',
  tripSaveSuccess: 'Saved successfully!',
  tripUploading: 'Uploading cover...',
  tripCoverLabel: 'Cover',
  tripCoverUpload: 'Select image',
  tripCoverTooLarge: 'Image too large. Limit: 10MB',
  tripTitleLabel: 'Title',
  tripTitlePlaceholder: 'Ex: Downwind Maranhão 2026',
  tripDescriptionLabel: 'Description',
  tripDescriptionPlaceholder: 'Describe the trip...',
  tripDestinationLabel: 'Destination',
  tripDestinationPlaceholder: 'Ex: Maranhão, Brazil',
  tripStartDate: 'Start date',
  tripEndDate: 'End date',
  tripDateError: 'End date must be after start date',
  tripMaxParticipantsLabel: 'Max participants',
  tripMaxParticipantsPlaceholder: 'Ex: 12',
  tripMaxParticipantsError: 'Minimum 2 participants',
  tripStatusLabel: 'Status',
  tripInvite: 'Invite',
  tripInviteFriends: 'Invite Friends',
  tripInviteButton: 'Invite',
  tripInvited: 'Invited',
  tripNoFriendsToInvite: 'No friends available',
  tripChat: 'Chat',
  tripTabInfo: 'Info',
  tripTabParticipants: 'People',
  tripTabFeed: 'Feed',
  tripNoParticipants: 'No participants yet',
  tripRoleOrganizer: 'Organizer',
  tripRoleParticipant: 'Participant',
  tripPending: 'Pending',
  tripRemoveConfirm: 'Remove this participant?',
  tripFeedEmpty: 'No posts yet',
  tripFeedJoinFirst: 'Join the trip to see the feed',
  tripVisibilityLabel: 'Visibility',
  tripVisibilityPublic: 'Public — appears in listing',
  tripVisibilityPrivate: 'Private — only participants see',

  // FASE 7 — UserProfile
  profileTabProfile: 'Profile',
  profileTabBookings: 'My Bookings',
  profileTabProducts: 'Products',
  profileTabGallery: 'Gallery',
  profileTabTrips: 'Trips',
  profileTabFeed: 'Feed',
  profileTabFriends: 'Friends',
  profileTabChat: 'Chat',
  profilePersonalData: 'Personal Data',
  profileFullName: 'Full Name',
  profileFullNamePlaceholder: 'Your full name',
  profileBio: 'Athlete Bio',
  profileBioPlaceholder: 'Tell your story: when you started kitesurfing, your favorite spots, achievements...',
  profileEmail: 'Email',
  profilePhone: 'Phone',
  profilePhonePlaceholder: '(92) 99999-0000',
  profileWhatsApp: 'WhatsApp',
  profileWhatsAppRequired: 'WhatsApp (required for contact)',
  profileSaving: 'Saving...',
  profileSave: 'Save Profile',
  profileMemberSince: 'Member since:',
  profileBack: 'Back',
  profileStatsBookings: 'Bookings',
  profileStatsConfirmed: 'Confirmed',
  profileStatsProducts: 'Products',
  profileStatsReservations: 'booking(s)',
  profileNoBookings: 'No bookings yet',
  profileNoBookingsHint: 'Your experiences, classes and downwinds will appear here',
  profileProductsPhysical: 'Physical Products',
  profileProductsCount: 'product(s)',
  profileNoProducts: 'No products purchased',
  profileNoProductsHint: 'Rashguards, hats, accessories and more',
  profileGoToShop: 'Go to Shop',
  profilePurchasedIn: 'Purchased on',
  profileDelivered: 'Product delivered',
  profilePendingConfirmation: 'Awaiting confirmation',
  profileDeliveryStatus: 'Delivery status',
  profileSessionsGallery: 'Sessions Gallery',
  profileSessionsDescription: 'Official photos taken by the Amazon Wind team during your sessions. Download, comment and connect with other participants.',
  profileNoSessions: 'No sessions completed',
  profileNoSessionsHint: 'Complete an experience to access session photos',
  profileSessionCompleted: 'Completed',
  profileGallerySoon: 'Gallery will be available from the team soon',
  profileTripComments: 'Trip Comments',
  profileTripCommentsSoon: 'Soon you will be able to comment and interact with other session participants!',
  profileMyTrips: 'My Trips',
  profileMyTripsDescription: 'Trips you organized or participate in.',
  profileNoTrips: 'No trips yet',
  profileNoTripsHint: 'Create or join a trip',
  profileViewTrips: 'View Trips',
  profileStatusDraft: 'Draft',
  profileStatusPublished: 'Published',
  profileStatusFull: 'Full',
  profileStatusCancelled: 'Cancelled',
  profileStatusCompleted: 'Completed',
  profileParticipants: 'participants',
  profileCommunityFeed: 'Community Feed',
  profileCommunityFeedDescription: 'Connect with other riders. Share your sessions, photos and kitesurfing achievements.',
  profileErrorAvatar: 'Error uploading avatar:',
  profileErrorSave: 'Error saving:',
  profileSuccessSave: 'Profile updated successfully!',
  profileBookingTypeExperience: 'Experience',
  profileBookingTypeClass: 'Class',
  profileBookingTypeProduct: 'Product',

  // FASE 7 — KiteCoursePage
  kiteCourseTitle: 'Beginner Kitesurf Lesson',
  kiteCourseSubtitle: 'Beginner Module',
  kiteCourseIncludesTitle: "What's included",
  kiteCourseInclude1: '10 practical lessons (total duration: 30h)',
  kiteCourseInclude2: 'Complete equipment included (kite, bar, board, vest)',
  kiteCourseInclude3: 'Safety and meteorology theory',
  kiteCourseInclude4: 'IKO certified instructor',
  kiteCourseInclude5: 'Accident insurance during lessons',
  kiteCourseInclude6: 'Beginner level completion certificate',
  kiteCourseInclude7: 'Video analysis of sessions',
  kiteCourseInclude8: 'Water and snacks during lessons',
  kiteCourseModule1Title: 'Module 1 — Fundamentals',
  kiteCourseModule1Desc: 'Beach theory, equipment assembly, first flights with kite on sand, basic bar control.',
  kiteCourseModule2Title: 'Module 2 — Water',
  kiteCourseModule2Desc: 'Body drag, water start, water control, instructor-assisted flight, first maneuvers.',
  kiteCourseModule3Title: 'Module 3 — Independence',
  kiteCourseModule3Desc: 'Autonomous basic maneuvers, transition, carving, guided downwind and video analysis.',
  kiteCourseTotalHours: '30h total',
  kiteCourseTotalClasses: 'classes',
  kiteCourseInvestment: 'Investment',
  kiteCourseInvestmentSummary: '10 complete classes • Equipment included • IKO Certification',
  kiteCourseAbout: 'About the Course',
  kiteCourseAboutText: 'Our Beginner module is the complete program for those who want to learn kitesurfing from scratch. With 10 practical lessons distributed in 3 progressive modules, you go from beach theory to performing your first maneuvers independently. All equipment is provided and lessons are taught by IKO certified instructors in the best wind and water conditions of the Amazon coast.',
  kiteCourseWhatIncluded: "What's included",
  kiteCourseModules: 'Course Modules',
  kiteCourseClasses: 'classes',
  kiteCourseGallery: 'Gallery',
  kiteCourseSchedule: 'Schedule Classes',
  kiteCourseScheduleDescription: 'Select your class start and end dates. The calendar below helps you plan your course.',
  kiteCourseTotalInvestment: 'Total investment',
  kiteCourseScheduleButton: 'Schedule & Proceed',
  kiteCourseSelectDate: 'Select a date',
  kiteCourseReviews: 'Reviews',
  kiteCourseReviewsEmpty: 'Student reviews will appear here after course completion.',
  kiteCourseVideoSoon: 'Video coming soon',

  // FASE 7 — ExperienceDetail
  expDetailNotFound: 'Experience not found.',
  expDetailPackage: 'Package',
  expDetailIndividual: 'Individual',
  expDetailFullPackage: 'Full Package',
  expDetailWhatIncluded: "What's included in the package",
  expDetailWhatIncludedShort: "What's included",
  expDetailPackageTotal: 'Total package investment',
  expDetailPerPerson: 'per person',
  expDetailBookingDate: 'Booking Date',
  expDetailAddToCart: 'Add Package to Cart',
  expDetailSecurePayment: 'Secure payment via PIX, Card or PayPal',
  expDetailUserFallback: 'User',

  // FASE 7 — AdminDashboard
  adminAccessDenied: 'Access restricted to administrators.',
  adminHeroCover: 'Hero / Cover',
  adminTrips: 'Trips',
  adminLoadingDashboard: 'Loading Admin Dashboard...',
  adminPanel: 'Admin Panel',
  adminThemeLight: 'Light Mode',
  adminThemeDark: 'Dark Mode',
  adminCollapse: 'Collapse',
  adminOnline: 'Online',

  // FASE 7 — Feed components
  feedErrorLoading: 'Error loading feed.',
  feedPostError: 'Error posting.',
  feedPostTripPlaceholder: 'Post in trip "${tripName}"...',
  feedPostPlaceholder: 'Share your kite session... 🪁',
  feedPostSuccess: 'Published successfully!',
  feedPostMedia: 'Photo/Video',
  feedPostSending: 'Sending media...',
  feedPostPublishing: 'Publishing...',
  feedPostButton: 'Publish',
  feedCommentLoading: 'Loading...',
  feedCommentEmpty: 'No comments yet.',
  feedCommentPlaceholder: 'Write a comment...',
  feedCommentSend: 'Send',
  feedCommentSave: 'Save',
  feedCommentCancel: 'Cancel',
  feedCommentRider: 'Rider',
  feedPostNow: 'now',
  feedPostEdited: 'edited',
  feedPostDeleteConfirm: 'Delete this post?',
  feedPostErrorSave: 'Error saving',
  feedPostSaving: 'Saving...',
  feedPostSave: 'Save',
  feedPostComment: 'Comment',
  feedPostShare: 'Share',

  // FASE 7 — Chat components
  chatRiderFallback: 'Rider',
  chatDeletedMessage: 'Message deleted',
  chatMessageFallback: 'Message',
  chatReply: 'Reply',
  chatDelete: 'Delete',
  chatCancel: 'Cancel',
  chatMessagePlaceholder: 'Message...',

  // FASE 7 — ConversationsList
  convRiderFallback: 'Rider',
  convYesterday: 'Yesterday',
  convTitle: 'Conversations',
  convSearchPlaceholder: 'Search riders...',
  convSearching: 'Searching...',
  convEmpty: 'No conversations yet. Search for a rider above to start!',
  convStartChat: 'Start conversation...',

  // FASE 7 — Community
  communityLoginButton: 'Sign in',

  // FASE 7 — Notifications
  notificationNow: 'Now',
  notificationMin: 'min',
  notificationHour: 'h',
  notificationDay: 'd',

  // FASE 7 — Friends
  friendsRiderFallback: 'Rider',

  // FASE 7 — Products
  productNotFound: 'Product not found.',
  productAddedToCart: 'Added to cart!',
  productInCart: 'in cart',
  productContinueShopping: 'Continue Shopping',
  productViewCart: 'View Cart',
  productOutOfStock: 'This product is currently out of stock.',
  productViewOthers: 'View other products',

  // FASE 7 — Wishlist
  wishlistAlreadyInCart: 'This item is already in the cart',
  wishlistAdded: 'added to cart!',
  wishlistRemoved: 'Removed from favorites',
  wishlistTitle: 'Wishlist',
  wishlistSubtitle: 'Items saved for future booking',
  wishlistEmpty: 'No favorites yet',
  wishlistEmptyHint: 'Tap the heart icon on any experience or product to save it here.',
  wishlistInCart: '✓ In Cart',
  wishlistAddToCart: 'Add to Cart',
  wishlistRemove: 'Remove',
  wishlistItem: 'item',
  wishlistItems: 'items',

  // FASE 7 — Trips (error/status)
  tripErrorLoad: 'Error loading trip',
  tripErrorJoin: 'Error joining trip',
  tripErrorLeave: 'Error leaving trip',
  tripErrorInvite: 'Error sending invite',
  tripErrorRemove: 'Error removing participant',
  tripErrorCreate: 'Error creating trip',
  tripErrorSave: 'Error saving',
  tripErrorUpload: 'Upload failed:',
  tripNotAuthenticated: 'Not authenticated',
  tripStatusPublic: '🌐 Public',
  tripStatusPrivate: '🔒 Private',
  tripAgo: 'now',

  // FASE 7 — ShareDialog
  shareRiderFallback: 'Rider',
  shareGroupFallback: 'Group',
  shareTripFallback: 'Trip',
  shareConvFallback: 'Conversation',
  shareSent: 'Sent!',

  // FASE 7 — FavoriteButton
  favRemoveAria: 'Remove from favorites',
  favAddAria: 'Add to favorites',

  // FASE 7 — Header
  headerMenu: 'Menu',
  headerAbout: 'About',
  headerToggleTheme: 'Toggle theme',
  headerUserFallback: 'User',
  headerMyProfile: 'My Profile',
  headerAdminPanel: 'Admin Panel',
  headerLogin: 'Sign in',
  headerCart: 'Cart',

  // FASE 7 — CartCheckout
  checkoutTestimonial1: 'Incredible experience! Everything was organized perfectly. Highly recommend!',
  checkoutTestimonial2: 'Sensational kite class. Safety and fun at the same time.',
  checkoutTestimonial3: 'Most beautiful downwind route I have ever done. Top team!',
  checkoutEmpty: 'Explore our experiences, products and classes and add items to the cart to book.',
  checkoutEmptyHint: '',
  checkoutSummary: 'Booking Summary',
  checkoutSubtotal: 'Subtotal',
  checkoutPixDiscount: 'PIX Discount (5%)',
  checkoutTotal: 'Total',
  checkoutWhatsApp: 'WhatsApp for contact',
  checkoutFilled: '(filled)',
  checkoutPaymentMethod: 'Payment Method',
  checkoutCard: 'Card',
  checkoutUpTo: 'Up to 6x',
  checkoutInternational: 'International',
  checkoutPixInstant: 'Instant Approval',
  checkoutPixDiscountApplied: '5% discount applied',
  checkoutPixKey: 'PIX Key (Copy & Paste):',
  checkoutPixCopy: 'Copy PIX Key',
  checkoutPixCopied: '✓ Copied!',
  checkoutCardPlaceholder: '0000 0000 0000 0000',
  checkoutCardName: 'Name on card',
  checkoutInstallments: 'Installments',
  checkoutInterestFree: 'interest-free',
  checkoutPaypalTitle: 'PayPal Checkout',
  checkoutPaypalDescription: 'You will be redirected to PayPal to complete the payment securely.',
  checkoutConfirmPayment: 'Confirm Payment',
  checkoutTestimonialsTitle: 'What our customers say',
  checkoutSecurePayment: '100% Secure',
  checkoutEncryptedPayment: 'Encrypted Payment',
  checkoutGuarantee: 'Amazon Wind Guarantee',
  checkoutWhatsAppSupport: 'WhatsApp Support',
  checkoutAddItemFirst: 'Add an item to the cart first',
  checkoutWhatsAppRequired: 'Enter your WhatsApp for contact.',
  checkoutCreateAccount: 'Create account',
  checkoutItemRemoved: 'Item removed from cart',

  // FASE 7 — Splash / ProtectedRoute
  splashSubtitle: 'Kitesurf & Expeditions',
  protectedRouteLoading: 'Verifying Amazon Wind credentials...',

  // FASE 7 — Admin components (heroes)
  heroSlideLimit: 'Limit of 6 slides reached. Delete a slide before creating another.',
  heroMediaRequired: 'Please provide or upload the background media.',
  heroTitleRequired: 'Title is required.',
  heroSlideUpdated: 'Slide updated successfully!',
  heroSlideCreated: 'Slide created successfully!',
  heroSlideRemoved: 'Official slide removed from display.',
  heroSlideDeleted: 'Slide deleted.',
  heroManageTitle: 'Manage Hero / Cover',
  heroManageDescription: 'Control the highlight media and text on the homepage.',
  heroSlideCount: 'Limit of 6 slides reached',
  heroNewSlide: '+ New Slide',
  heroDimensionTip: 'Dimension suggestion:',
  heroUploadTip: 'You can upload image or video.',
  heroLoading: 'Loading slides...',
  heroNoSlides: 'No slides configured.',
  heroCreateFirst: 'Create first slide',
  heroTypeYoutube: 'YouTube',
  heroTypeVideo: 'Video',
  heroTypeImage: 'Image',
  heroOfficial: 'Official',
  heroCtaPrefix: 'CTA:',
  heroMoveUp: 'Move up',
  heroMoveDown: 'Move down',
  heroEdit: 'Edit',
  heroDelete: 'Delete',
  heroEditSlide: 'Edit Slide',
  heroNewSlideTitle: 'New Hero Slide',
  heroTitleLabel: 'Highlight Title',
  heroTitlePlaceholder: 'Ex: Expeditions on the North Coast',
  heroSubtitleLabel: 'Subtitle',
  heroSubtitlePlaceholder: 'Ex: Feel the strength of the trade winds',
  heroMediaTypeLabel: 'Media Type',
  heroOrderLabel: 'Order',
  heroUploadLabel: 'Upload File',
  heroUrlLabel: 'Or paste the direct link (URL)',
  heroUrlPlaceholder: 'https://example.com/image.jpg or YouTube link',
  heroCtaTextLabel: 'Button Text (CTA)',
  heroCtaTextPlaceholder: 'Explore Routes',
  heroCtaLinkLabel: 'Button Link',
  heroCancel: 'Cancel',
  heroSaving: 'Saving...',
  heroUpdate: 'Update',
  heroCreate: 'Create Slide',
  heroDeleteTitle: 'Delete Slide',
  heroDeleteConfirm: 'Are you sure you want to delete "${deleteTarget.title}"?',
  heroDeleteYes: 'Yes, Delete',

  // FASE 7 — Admin components (bookings)
  bookingUpdated: 'Booking updated successfully!',
  bookingDeleted: 'Booking deleted.',
  bookingTypeExperience: 'Experience',
  bookingTypeClass: 'Class',
  bookingTypeProduct: 'Product',
  bookingConfirmAction: 'Do you want to confirm/cancel this booking?',
  bookingPaid: 'Payment confirmed',
  bookingDetails: 'Booking Details',
  bookingClientInfo: 'Client Information',
  bookingFieldName: 'Name:',
  bookingFieldEmail: 'Email:',
  bookingFieldWhatsApp: 'WhatsApp:',
  bookingFieldPhone: 'Phone:',
  bookingNoContact: 'No contact information registered',
  bookingReservationDetails: 'Booking Details',
  bookingFieldType: 'Type',
  bookingFieldItemId: 'Item ID',
  bookingReservedItems: 'Reserved Items',
  bookingStatusPending: 'Pending',
  bookingStatusConfirmed: 'Confirmed',
  bookingStatusCancelled: 'Cancelled',
  bookingDate: 'Booking Date',
  bookingNotes: 'Notes / Observations',
  bookingCancel: 'Cancel',
  bookingDelete: 'Delete',
  bookingSaving: 'Saving...',
  bookingSave: 'Save Changes',
  bookingDeleteTitle: 'Delete Booking',
  bookingDeleteConfirm: 'Are you sure you want to delete this booking? This action cannot be undone.',

  // FASE 7 — Admin components (classes)
  classErrorLoad: 'Error loading classes:',
  classErrorUpdate: 'Error updating class:',
  classUpdated: 'Class updated successfully!',
  classErrorCreate: 'Error creating class:',
  classCreated: 'Class created successfully!',
  classErrorDelete: 'Error deleting class:',
  classDeleted: 'Class deleted.',
  classLoading: 'Loading classes...',
  classManageTitle: 'Manage Classes',
  classManageDescription: 'Configure class packages, media and prices.',
  classNewButton: '+ New Class',
  classEmpty: 'No classes registered',
  classEdit: 'Edit',
  classDelete: 'Delete',
  classEditTitle: 'Edit Class',
  classNewTitle: 'New Class',
  classFieldTitle: 'Title',
  classFieldTitlePlaceholder: 'Ex: Private Kite Lesson',
  classFieldPrice: 'Price (R$)',
  classFieldDuration: 'Duration',
  classFieldDurationPlaceholder: 'Ex: 2h30',
  classFieldLevel: 'Level',
  classFieldLevelPlaceholder: 'Ex: Beginner / Intermediate',
  classFieldDescription: 'Description',
  classFieldImage: 'Main Class Image',
  classFieldVideo: 'Promotional Video (Optional)',
  classCancel: 'Cancel',
  classSaving: 'Saving...',
  classUpdate: 'Update',
  classCreate: 'Create Class',
  classDeleteTitle: 'Delete Class',
  classDeleteConfirm: 'Are you sure you want to delete "${deleteTarget.title}"?',

  // FASE 7 — Admin components (about)
  aboutTitleRequired: 'Title is required.',
  aboutUpdated: '"About" page updated!',
  aboutCreated: '"About" page created!',
  aboutManageTitle: 'Manage "About" Page',
  aboutManageDescription: 'Edit the about page content in each language.',
  aboutEditContent: 'Edit Content',
  aboutLoading: 'Loading content...',
  aboutMainContent: 'Main Content',
  aboutFieldTitle: 'Title',
  aboutFieldTitlePlaceholder: 'Ex: About Amazon Wind',
  aboutFieldSubtitle: 'Subtitle',
  aboutFieldSubtitlePlaceholder: 'Ex: Kitesurf School & Expeditions',
  aboutFieldDescription: 'Description',
  aboutFieldDescriptionPlaceholder: 'Complete company history...',
  aboutMissionVision: 'Mission & Vision',
  aboutFieldMission: 'Mission',
  aboutFieldMissionPlaceholder: 'Company mission...',
  aboutFieldVision: 'Vision',
  aboutFieldVisionPlaceholder: 'Company vision...',
  aboutMedia: 'Media',
  aboutCoverImage: 'Cover Image',
  aboutCoverUrl: 'Or paste cover URL',
  aboutVideoUrl: 'Video URL (YouTube or direct link)',
  aboutGallery: 'Gallery',
  aboutGalleryPlaceholder: 'Gallery image URL',
  aboutAddButton: '+ Add',
  aboutCancel: 'Cancel',
  aboutSaving: 'Saving...',
  aboutUpdate: 'Update',
  aboutCreate: 'Create',
  aboutUnsavedData: 'Official data (not saved)',
  aboutLabelTitle: 'Title',
  aboutLabelSubtitle: 'Subtitle',
  aboutLabelDescription: 'Description',
  aboutLabelMission: 'Mission',
  aboutLabelVision: 'Vision',
  aboutLabelMedia: 'Media',
  aboutLabelCover: 'Cover',
  aboutLabelVideo: 'Video',
  aboutGalleryCount: 'Gallery (${count} images)',

  // FASE 7 — Admin components (products)
  productAdminName: 'Product',
  productAdminPrice: 'Price',
  productAdminStock: 'Stock',
  productAdminActions: 'Actions',
  productAdminUnit: ' unit',
  productAdminEdit: 'Edit',
  productAdminDelete: 'Delete',
  productAdminCategoryPlaceholder: 'New category name',
  productAdminCancel: 'Cancel',
  productAdminNew: '+ New',

  // FASE 7 — Admin components (trips)
  tripAdminStatusUpdated: 'Status updated!',
  tripAdminError: 'Error:',
  tripAdminDeleteConfirm: 'Are you sure you want to delete this trip?',
  tripAdminDeleted: 'Trip deleted!',
  tripAdminDraft: 'Draft',
  tripAdminPublished: 'Published',
  tripAdminFull: 'Full',
  tripAdminCancelled: 'Cancelled',
  tripAdminCompleted: 'Completed',
  tripAdminPublic: 'Public',
  tripAdminPrivate: 'Private',
  tripAdminAll: 'All',
  tripAdminEmpty: 'No trips found',
  tripAdminParticipants: ' participants',

  // FASE 7 — Admin components (shared)
  sharedStatusPending: 'Pending',
  sharedStatusConfirmed: 'Confirmed',
  sharedStatusCancelled: 'Cancelled',
  sharedUploadError: 'Could not get file URL.',
  sharedUploading: 'Uploading...',
  sharedChooseVideo: 'Choose video',
  sharedChooseImage: 'Choose image',

  // FASE 7 — Admin components (financial)
  financialStatusPending: 'Pending',
  financialStatusPaid: 'Paid',
  financialStatusOverdue: 'Overdue',
  financialTypePayable: 'Payable',
  financialTypeReceivable: 'Receivable',
  financialCategoryRent: 'Rent',
  financialCategoryEquipment: 'Equipment',
  financialCategoryMarketing: 'Marketing',
  financialCategorySalaries: 'Salaries',
  financialCategoryServices: 'Services',
  financialCategoryOperations: 'Operations',
  financialCategoryClasses: 'Class Revenue',
  financialCategoryExpeditions: 'Expedition Revenue',
  financialCategoryProducts: 'Product Revenue',
  financialCategoryOther: 'Other',
  financialUpdated: 'Account updated!',
  financialCreated: 'Account created!',
  financialDeleted: 'Account deleted.',
  financialSummary: 'Financial Summary',
  financialPay: 'Pay',
  financialReceive: 'Receive',
  financialBalance: 'Balance',
  financialFilters: 'Filters',
  financialAllTypes: 'All Types',
  financialAllStatuses: 'All Statuses',
  financialNewEntry: '+ New Entry',
  financialEntries: 'Entries',
  financialItems: ' items',
  financialEmpty: 'No entries found',
  financialFieldDescription: 'Description',
  financialFieldDescriptionPlaceholder: 'Ex: Space rental, Private class...',
  financialFieldType: 'Type',
  financialFieldValue: 'Amount (R$)',
  financialFieldDueDate: 'Due Date',
  financialFieldCategory: 'Category',
  financialFieldCategoryPlaceholder: 'Select...',
  financialFieldStatus: 'Status',
  financialFieldNotes: 'Notes',
  financialFieldNotesPlaceholder: 'Optional...',
  financialCancel: 'Cancel',
  financialSaving: 'Saving...',
  financialUpdate: 'Update',
  financialCreate: 'Create Account',
  financialDeleteTitle: 'Delete Entry',
  financialDeleteConfirm: 'Are you sure you want to delete "${deleteTarget.description}"?',

  // FASE 7 — Admin components (experiences)
  expAdminPackage: 'Package',
  expAdminIndividual: 'Individual',
  expAdminItemsIncluded: ' items included',
  expAdminTypeLabel: 'Experience Type',
  expAdminTypeIndividual: 'Individual Experience',
  expAdminTypeIndividualDesc: 'Single class, downwind, etc.',
  expAdminTypePackage: 'Full Package',
  expAdminTypePackageDesc: 'All-Inclusive, course, etc.',
  expAdminCategoryPlaceholder: 'New category name',
  expAdminCancel: 'Cancel',
  expAdminNew: '+ New',
  expAdminOriginalPrice: 'Original Price (reference, optional)',
  expAdminOriginalPricePlaceholder: 'Ex: 14500.00 (shows discount)',
  expAdminOriginalPriceHelp: 'If filled, shows crossed-out price and discount percentage.',
  expAdminIncludedItems: "What's included (1 item per line)",
  expAdminIncludedPlaceholder: '10 practical lessons (30h)\nComplete equipment\nIKO Certification\nAccident insurance\nWater and snacks',
  expAdminIncludedHelp: 'Separate each item by line...',

  // FASE 7 — Experiencias (landing section)
  expLandingDiscover: 'Discover',
  expLandingTitle: 'Experiences & Downwinds',
  expLandingDescription: 'Exclusive routes through the Atlantic Amazon. Each route is a new adventure.',
  expLandingDetails: 'See Details →',

  // FASE 7 — KiteSchool component
  kiteSchoolAlt: 'Kitesurf lesson',

  // FASE 7 — ContactNewsletter
  contactSendAnother: 'Send another message',

  // FASE 7 — Servicos
  svcWhatsAppRequired: 'Enter the WhatsApp number for contact.',
  svcDepartureAfterArrival: 'Departure must be after Arrival',

  // FASE 7 — Footer
  footerWhatsApp: 'WhatsApp',

  // FASE 7 — InstallAppBanner
  bannerClose: 'Close',

  // Accessibility aria-labels
  ariaAttach: 'Attach file',
  ariaLike: 'Like',
  ariaUnlike: 'Unlike',

  // Admin — Hero (additional keys)
  heroManageSubtitle: 'Control the featured media and text on the homepage.',
  heroDimensionHelp: 'You can upload a file, paste a direct link (URL) of image/video, or paste a YouTube link — the media type will be detected automatically.',
  heroEmpty: 'No slides configured.',
  heroBadgeYouTube: 'YouTube',
  heroBadgeVideo: 'Video',
  heroBadgeImage: 'Image',
  heroBadgeOfficial: 'Official',
  heroCTA: 'CTA: ',
  heroHighlightTitle: 'Highlight Title',
  heroHighlightPlaceholder: 'E.g.: North Coast Expeditions',
  heroMediaType: 'Media Type',
  heroOrder: 'Order',
  heroUploadFile: 'Upload File',
  heroOrPasteUrl: 'Or paste the direct link (URL)',
  heroButtonText: 'Button Text',
  heroButtonLink: 'Button Link',
  heroSaveSlide: 'Create Slide',
  heroLimitReached: 'Slide limit of 6 reached. Delete a slide before creating another.',
  heroOfficialRemoved: 'Official slide removed from display.',

  // Admin — Financial (additional keys)
  finPending: 'Pending',
  finPaid: 'Paid',
  finOverdue: 'Overdue',
  finPayable: 'To Pay',
  finReceivable: 'To Receive',
  finAccountUpdated: 'Account updated!',
  finAccountCreated: 'Account created!',
  finAccountDeleted: 'Account deleted.',
  finSummary: 'Financial Summary',
  finToPay: 'Pay',
  finToReceive: 'Receive',
  finBalance: 'Balance',
  finReceived: 'Received',
  finFilters: 'Filters',
  finAllTypes: 'All Types',
  finAllStatuses: 'All Statuses',
  finNewAccount: '+ New Account',
  finTransactions: 'Transactions',
  finItems: ' items',
  finLoading: 'Loading...',
  finEmpty: 'No transactions found',
  finDescription: 'Description',
  finType: 'Type',
  finCategory: 'Category',
  finAmount: 'Amount',
  finDueDate: 'Due Date',
  finStatus: 'Status',
  finActions: 'Actions',
  finEdit: 'Edit',
  finDelete: 'Delete',
  finEditAccount: 'Edit Account',
  finNewAccountTitle: 'New Account',
  finFormType: 'Type',
  finFormDescription: 'Description',
  finFormDescriptionPlaceholder: 'E.g.: Space rent, Private lesson...',
  finFormAmount: 'Amount (R$)',
  finFormDueDate: 'Due Date',
  finFormCategory: 'Category',
  finFormSelect: 'Select...',
  finFormStatus: 'Status',
  finFormNotes: 'Notes',
  finFormNotesPlaceholder: 'Optional...',
  finFormCancel: 'Cancel',
  finFormSaving: 'Saving...',
  finFormCreate: 'Create Account',
  finDeleteTitle: 'Delete Transaction',
  finDeleteConfirm: 'Are you sure you want to delete',
  finCategoryRent: 'Rent',
  finCategoryEquipment: 'Equipment',
  finCategoryMarketing: 'Marketing',
  finCategorySalaries: 'Salaries',
  finCategoryServices: 'Services',
  finCategoryOperational: 'Operational',
  finCategoryClassRevenue: 'Class Revenue',
  finCategoryExpeditionRevenue: 'Expedition Revenue',
  finCategoryProductRevenue: 'Product Revenue',
  finCategoryOther: 'Other',

  // Admin — Trips (additional keys)
  tripsAll: 'All',
  tripsParticipants: ' participants',
  tripsDraft: 'Draft',
  tripsPublished: 'Published',
  tripsFull: 'Full',
  tripsCancelled: 'Cancelled',
  tripsCompleted: 'Completed',
  tripsPublic: 'Public',
  tripsPrivate: 'Private',
  tripsStatusUpdated: 'Status updated!',
  tripsDeleteTitle: 'Delete',
  tripsDeleted: 'Trip deleted!',

  // Admin — Classes (additional keys)
  classesTitle: 'Manage Classes',
  classesSubtitle: 'Configure class packages, media and pricing.',
  classesNew: '+ New Class',
  classesEmpty: 'No classes registered',
  classesEdit: 'Edit',
  classesDelete: 'Delete',
  classesEditTitle: 'Edit Class',
  classesNewTitle: 'New Class',
  classesFormTitle: 'Title',
  classesFormTitlePlaceholder: 'E.g.: Private Kite Lesson',
  classesFormPrice: 'Price (R$)',
  classesFormDuration: 'Duration',
  classesFormDurationPlaceholder: 'E.g.: 2h30',
  classesFormLevel: 'Level',
  classesFormLevelPlaceholder: 'E.g.: Beginner / Intermediate',
  classesFormDescription: 'Description',
  classesFormImage: 'Main Class Image',
  classesFormVideo: 'Promotional Video (Optional)',
  classesCancel: 'Cancel',
  classesSaving: 'Saving...',
  classesUpdate: 'Update',
  classesCreate: 'Create Class',
  classesDeleteTitle: 'Delete Class',
  classesDeleteConfirm: 'Are you sure you want to delete',
  classesUpdated: 'Class updated!',
  classesCreated: 'Class created!',
  classesDeleted: 'Class deleted.',
  classesLoadError: 'Error loading classes',
  classesUpdateError: 'Error updating class',
  classesCreateError: 'Error creating class',
  classesDeleteError: 'Error deleting class',
  classesLoading: 'Loading classes...',

  // Admin — About (additional keys)
  aboutTitleLabel: 'Title',
  aboutSubtitleLabel: 'Subtitle',
  aboutSubtitlePlaceholder: 'E.g.: Kite School & Expeditions',
  aboutDescription: 'Description',
  aboutDescriptionPlaceholder: 'Complete company history...',
  aboutMissionPlaceholder: 'Company mission...',
  aboutVisionPlaceholder: 'Company vision...',
  aboutGalleryAlt: 'Gallery ',
  aboutAdd: '+ Add',
  aboutUnsaved: 'Official data (not saved)',

  // Admin — Products (additional keys)
  prodProduct: 'Product',
  prodPrice: 'Price',
  prodStock: 'Stock',
  prodActions: 'Actions',
  prodUnit: ' ea.',
  prodEdit: 'Edit',
  prodDelete: 'Delete',
  prodNewCategory: 'New category name',
  prodCancel: 'Cancel',
  prodNew: '+ New',

  // Admin — Experiences (additional keys)
  expTypePackage: 'Package',
  expTypeIndividual: 'Individual',
  expItemsIncluded: ' items included',
  expTypeLabel: 'Experience Type',
  expTypeIndividualBtn: 'Individual Experience',
  expTypeIndividualDesc: 'Single class, downwind, etc.',
  expTypePackageBtn: 'Complete Package',
  expTypePackageDesc: 'All-Inclusive, course, etc.',
  expNewCategory: 'New category name',
  expCancel: 'Cancel',
  expNew: '+ New',
  expOriginalPrice: 'Original Price (reference, optional)',
  expOriginalPriceHelp: 'If filled in, shows the struck-through price and discount percentage.',
  expIncludes: 'What is included (1 item per line)',
  expIncludesHelp: 'Separate each item by line. These items will appear on the experience details page.',

  // Admin — Bookings (additional keys)
  bookingGuest: 'Guest',
  bookingPaymentConfirmed: 'Payment confirmed',
  bookingName: 'Name:',
  bookingEmail: 'Email:',
  bookingWhatsApp: 'WhatsApp:',
  bookingPhone: 'Phone:',
  bookingStatusLabel: 'Status',
  bookingDateLabel: 'Booking Date',

  // Admin — Shared (additional keys)
  sharedPending: 'Pending',
  sharedConfirmed: 'Confirmed',
  sharedCancelled: 'Cancelled',
  sharedSending: 'Sending...',

  // Admin — Reviews (additional keys)
  reviewUser: 'User',
  reviewDeleted: 'Review deleted',
}

const es: TranslationKeys = {
  navExperiencias: 'Experiencias',
  navEscola: 'Escuela',
  navServicos: 'Servicios',
  navContato: 'Contacto',

  heroTagline: 'Expediciones · Downwinds · Experiencias en la Amazonía Atlántica',
  heroTitle1: 'La Amazonía es nuestro',
  heroTitleHighlight: 'punto de partida',
  heroSubtitle: 'No queremos solo organizar viajes. Queremos revelar un territorio.',
  heroCTA1: 'Ver Experiencias',
  heroCTA2: 'Agendar Clase',

  expLabel: 'Descubre',
  expTitle: 'Experiencias & Downwinds',
  expSubtitle: 'Rutas exclusivas por la Amazonia Atlántica. Cada trayecto es una nueva aventura.',

  exp1Title: 'Ajuruteua → Salinas',
  exp1Desc: 'Navega entre playas salvajes y aguas cristalinas de Pará. Viento constante y olas perfectas para un downwind inolvidable.',
  exp2Title: 'Salinas → Algodoal',
  exp2Desc: 'Expedición completa entre islas paradisíacas. Parada para buceo y contemplación de la fauna amazónica.',
  exp3Title: 'Vuelo de los Guáros',
  exp3Desc: 'Sigue el vuelo de los guáros rojos al atardecer. Una experiencia mágica de contemplación y naturaleza.',
  exp4Title: 'Carimbó en la Playa',
  exp4Desc: 'Rueda de Carimbó con maestros locales al son del mar. Inmersión en la cultura y el ritmo amazónico.',

  badgeDownwind: 'Downwind',
  badgeExpedition: 'Expedición',
  badgeCultural: 'Experiencia Cultural',
  levelIntermediate: 'Intermedio',
  levelIntermediateAdv: 'Intermedio/Avanzado',
  levelAll: 'Todos los niveles',

  ksLabel: 'Aprende',
  ksTitle: 'KiteSchool',
  ksSubtitle: 'Clases particulares y en grupo con instructores certificados. Desde tu primer vuelo hasta la independencia.',
  ksMostPopular: 'Más Popular',
  ksSchedule: 'Agendar Clase',
  ksBasic: 'Básico',
  ksBasicIncludes: ['Teoría en la playa', 'Montaje del equipo', 'Primeros vuelos en la arena', 'Supervisión individual'],
  ksBeginner: 'Principiante',
  ksBeginnerIncludes: ['Revisión de seguridad', 'Control en el agua', 'Vuelo asistido', 'Práctica de maniobras básicas'],
  ksSpecific: 'Específico',
  ksSpecificIncludes: ['Técnica avanzada', 'Downwind guiado', 'Corte y transición', 'Análisis de video'],

  svcLabel: 'Extras',
  svcTitle: 'Servicios & Productos',
  svcSubtitle: 'Todo lo que necesitas para tu experiencia amazónica, en un solo lugar.',
  svc1Title: 'Camisas UV',
  svc1Desc: 'Protección solar con diseño Amazon Wind. Tejido técnico de secado rápido.',
  svc1Price: 'Desde R$ 89',
  svc2Title: 'Gorras',
  svc2Desc: 'Gorras con viseras bordadas. Ideales para los vientos amazónicos.',
  svc2Price: 'Desde R$ 59',
  svc3Title: 'Transfer',
  svc3Desc: 'Reubicación y transfer entre playas. Vehículos adaptados para arena.',
  svc3Price: 'Bajo consulta',
  svc4Title: 'Alojamiento',
  svc4Desc: 'Asociación con posadas y residencias en Salinópolis y Ajuruteua.',
  svc4Price: 'Bajo consulta',
  svcBook: 'Agendar',
  svcBookTitle: 'Agendar Servicio',
  svcBookSuccess: '¡Solicitud enviada con éxito! Nos pondremos en contacto.',
  svcDateLabel: 'Fecha preferida',
  svcSchedule: 'Agendar ahora',
  svcRequired: 'Campos obligatorios',
  svcServiceLabel: 'Servicio',

  footerAbout: 'Escuela de Kitesurf y Expediciones en la Amazonia Atlántica. Fundada por Pingo, Pablo y Rafael.',
  footerContact: 'Contacto',
  footerLocation: 'Ubicación',
  footerRights: 'Todos los derechos reservados.',

  // ═══ ADMIN ═══
  adminDashboard: 'Panel',
  adminExperiences: 'Experiencias',
  adminProducts: 'Productos',
  adminClasses: 'Clases',
  adminBookings: 'Reservas',
  adminSettings: 'Configuración',
  adminLogout: 'Salir',
  adminBackToSite: 'Volver al Sitio',

  adminOverview: 'Resumen',
  adminTotalExperiences: 'Total de Experiencias',
  adminTotalProducts: 'Total de Productos',
  adminTotalBookings: 'Total de Reservas',
  adminPendingBookings: 'Pendientes',
  adminConfirmedBookings: 'Confirmadas',
  adminRevenue: 'Ingresos',
  adminConnected: 'Conectado',
  adminRecentBookings: 'Reservas Recientes',
  adminNoBookings: 'Sin reservas aún',
  adminQuickActions: 'Acciones Rápidas',

  adminExpTitle: 'Experiencias & Downwinds',
  adminExpSubtitle: 'Gestiona rutas, expediciones y experiencias culturales',
  adminNewExperience: 'Nueva Experiencia',
  adminEditExperience: 'Editar Experiencia',
  adminExpFormTitle: 'Título',
  adminExpFormDescription: 'Descripción',
  adminExpFormCategory: 'Categoría',
  adminExpFormNewCategory: 'Nueva Categoría',
  adminExpFormSelectCategory: 'Selecciona una categoría',
  adminExpFormPrice: 'Precio (R$)',
  adminExpFormDuration: 'Duración',
  adminExpFormLevel: 'Nivel',
  adminExpFormCommunity: 'Comunidad',
  adminExpFormImageUrl: 'URL de Imagen',
  adminExpFormVideoUrl: 'URL de Video',
  adminExpFormFeatured: 'Destacado en página principal',
  adminExpFormCreate: 'Crear Experiencia',
  adminExpFormUpdate: 'Actualizar',
  adminExpDeleteConfirm: '¿Estás seguro de que quieres eliminar esta experiencia?',
  adminExpCreated: '¡Experiencia creada con éxito!',
  adminExpUpdated: '¡Experiencia actualizada!',
  adminExpDeleted: 'Experiencia eliminada.',
  adminExpNoData: 'Sin experiencias registradas',
  adminLevels: ['Principiante', 'Intermedio', 'Avanzado', 'Todos los niveles'],

  adminProdTitle: 'Productos & E-commerce',
  adminProdSubtitle: 'Gestiona inventario, precios y categorías de productos',
  adminNewProduct: 'Nuevo Producto',
  adminEditProduct: 'Editar Producto',
  adminProdFormTitle: 'Nombre del Producto',
  adminProdFormDescription: 'Descripción',
  adminProdFormPrice: 'Precio (R$)',
  adminProdFormStock: 'Inventario',
  adminProdFormCategory: 'Categoría',
  adminProdFormImage: 'URL de Imagen',
  adminProdFormCreate: 'Crear Producto',
  adminProdFormUpdate: 'Actualizar',
  adminProdDeleteConfirm: '¿Estás seguro de que quieres eliminar este producto?',
  adminProdCreated: '¡Producto creado con éxito!',
  adminProdUpdated: '¡Producto actualizado!',
  adminProdDeleted: 'Producto eliminado.',
  adminProdNoData: 'Sin productos registrados',
  adminProdCategories: ['Ropa', 'Equipamiento', 'Accesorio', 'Consumible'],

  adminClassTitle: 'Clases & KiteSchool',
  adminClassSubtitle: 'Gestiona paquetes de clases, instructores y horarios',
  adminNewClass: 'Nueva Clase',
  adminEditClass: 'Editar Clase',
  adminClassFormTitle: 'Nombre de la Clase',
  adminClassFormDescription: 'Descripción',
  adminClassFormPrice: 'Precio (R$)',
  adminClassFormDuration: 'Duración',
  adminClassFormLevel: 'Nivel',
  adminClassFormInstructor: 'Instructor',
  adminClassFormCreate: 'Crear Clase',
  adminClassFormUpdate: 'Actualizar',
  adminClassDeleteConfirm: '¿Estás seguro de que quieres eliminar esta clase?',
  adminClassCreated: '¡Clase creada con éxito!',
  adminClassUpdated: '¡Clase actualizada!',
  adminClassDeleted: 'Clase eliminada.',
  adminClassNoData: 'Sin clases registradas',

  adminBookTitle: 'Reservas & Agenda',
  adminBookSubtitle: 'Visualiza y gestiona todas las reservas',
  adminBookFilterAll: 'Todas',
  adminBookFilterPending: 'Pendientes',
  adminBookFilterConfirmed: 'Confirmadas',
  adminBookFilterCancelled: 'Canceladas',
  adminBookConfirm: 'Confirmar',
  adminBookCancel: 'Cancelar',
  adminBookConfirmed: '¡Reserva confirmada!',
  adminBookCancelled: 'Reserva cancelada.',
  adminBookNoData: 'No se encontraron reservas',
  adminBookClient: 'Cliente',
  adminBookDate: 'Fecha',
  adminBookType: 'Tipo',
  adminBookStatus: 'Estado',
  adminBookActions: 'Acciones',

  // Financial Manager
  adminFinancial: 'Financiero',
  adminAbout: 'Sobre',
  adminFinPayable: 'A Pagar',
  adminFinReceivable: 'A Recibir',
  adminFinPending: 'Pendiente',
  adminFinPaid: 'Pagado',
  adminFinOverdue: 'Atrasado',
  adminFinNewAccount: 'Nueva Cuenta',
  adminFinEditAccount: 'Editar Cuenta',
  adminFinDescription: 'Descripción',
  adminFinAmount: 'Monto',
  adminFinDueDate: 'Vencimiento',
  adminFinCategory: 'Categoría',
  adminFinNotes: 'Notas',
  adminFinSave: 'Guardar',
  adminFinDeleteConfirm: '¿Está seguro de que desea eliminar esta cuenta?',

  // About Page
  aboutTitle: 'Sobre Amazon Wind',
  aboutSubtitle: 'Escuela de Kitesurf y Expediciones en la Amazonía',
  aboutMission: 'Misión',
  aboutVision: 'Visión',

  // Reviews
  adminReviews: 'Reseñas',
  reviewsTitle: 'Reseñas & Comentarios',
  reviewsAverage: 'Promedio',
  reviewsTotal: 'reseñas',
  reviewsWrite: 'Deja tu reseña',
  reviewsLoginToComment: 'Inicia sesión para comentar',
  reviewsSubmit: 'Enviar reseña',
  reviewsPendingNotice: 'Tu comentario será moderado antes de ser publicado.',
  reviewsNoReviews: 'Sin reseñas aún. ¡Sé el primero!',
  reviewsReply: 'Responder',
  reviewsReplyTo: 'Responder a',
  reviewsCancel: 'Cancelar',
  reviewsRating: 'Tu nota',
  reviewsComment: 'Tu comentario',
  reviewsSelectRating: 'Selecciona una nota',
  reviewsPending: 'Pendiente',
  reviewsApproved: 'Aprobado',
  reviewsRejected: 'Rechazado',
  reviewsApprove: 'Aprobar',
  reviewsReject: 'Rechazar',
  reviewsDelete: 'Eliminar',
  reviewsConfirmDelete: '¿Estás seguro de que deseas eliminar esta reseña?',
  reviewsAdminTitle: 'Gestionar Reseñas',
  reviewsAdminPending: 'Pendientes',
  reviewsAdminAll: 'Todas',

  favorites: 'Favoritos',

  cartTitle: 'Carrito',
  cartEmpty: 'Tu carrito está vacío',
  cartAddExperience: 'Agregar Experiencia',
  cartAddProduct: 'Agregar Producto',
  cartAddClass: 'Agregar Clase',
  cartTripDates: 'Fechas del Viaje',
  cartCheckIn: 'Llegada',
  cartCheckOut: 'Salida',
  cartNights: 'Noches',
  cartBasePrice: 'Precio Base / Noche',
  cartSubtotal: 'Subtotal',
  cartTotal: 'Total',
  cartCheckout: 'Completar Reserva',
  cartRemove: 'Eliminar',
  cartDays: 'días',
  cartPerNight: 'por noche',
  cartSelectDates: 'Selecciona las fechas del viaje',
  cartSummary: 'Resumen',
  cartAccommodation: 'Alojamiento',
  cartItemCount: 'artículos en el carrito',
  cartMyBookings: 'Mis Reservas',
  navHome: 'Inicio',
  navProfile: 'Perfil',
  checkoutContactInfo: 'Información de Contacto',
  checkoutName: 'Nombre',
  checkoutEmail: 'Correo',
  checkoutPhone: 'Teléfono',
  checkoutMessage: 'Mensaje',
  checkoutNameRequired: 'Ingresa tu nombre.',
  checkoutEmailRequired: 'Ingresa tu correo.',
  checkoutEmailInvalid: 'Correo inválido.',
  checkoutError: 'Error al crear reserva(s).',
  checkoutSuccess: 'Reserva confirmada!',
  checkoutSuccessDetail: 'Recibiras un correo de confirmacion pronto. Sigue tus reservas en el panel.',
  checkoutProcessing: 'Procesando...',
  checkoutLoginTitle: 'Iniciar sesion para continuar',
  checkoutLoginSubtitle: 'Accede a tu cuenta para completar la reserva',
  checkoutLoginGoogle: 'Iniciar sesion con Google',
  checkoutLoginDivider: 'o',
  checkoutLoginEmail: 'Correo',
  checkoutLoginPassword: 'Contrasena',
  checkoutLoginButton: 'Iniciar sesion',
  checkoutLoginForgot: 'Olvidaste la contrasena?',
  checkoutLoginNoAccount: 'No tienes cuenta?',
  checkoutLoggedInAs: 'Conectado como',
  checkoutGuest: 'Continuar como invitado',
  loginLoading: 'Cargando...',
  loginSubtitle: 'Accede a tu cuenta',
  loginEmail: 'Correo',
  loginPassword: 'Contrasena',
  loginButton: 'Iniciar sesion',
  loginAuthenticating: 'Autenticando...',
  loginBack: '← Volver al sitio principal',

  adminSave: 'Guardar',
  adminCancel: 'Cancelar',
  adminDelete: 'Eliminar',
  adminEdit: 'Editar',
  adminCreate: 'Crear',
  adminLoading: 'Cargando...',
  adminError: 'Error',
  adminSuccess: 'Éxito',
  adminSearch: 'Buscar...',
  adminNoResults: 'Sin resultados',
  adminConfirm: 'Confirmar',
  adminBack: 'Volver',
  adminNext: 'Siguiente',
  adminOf: 'de',

  navLogin: 'Iniciar',
  navAdmin: 'Admin',
  navMinhaConta: 'Mi Cuenta',

  contactTitle: 'Contáctanos',
  contactSubtitle: '¿Dudas? Envíanos un mensaje.',
  contactName: 'Nombre',
  contactEmail: 'Correo',
  contactPhone: 'Teléfono',
  contactMessage: 'Mensaje',
  contactSend: 'Enviar Mensaje',
  contactSuccess: '¡Mensaje enviado con éxito!',
  newsletterTitle: 'Mantente al día',
  newsletterSubtitle: 'Recibe novedades, promociones y consejos de kitesurf.',
  newsletterPlaceholder: 'Tu mejor correo',
  newsletterButton: 'Suscribir',
  newsletterSuccess: '¡Suscripción exitosa!',
  newsletterAlready: 'Este correo ya está registrado.',

  expDetailBook: 'Reservar Ahora',
  expDetailDuration: 'Duración',
  expDetailLevel: 'Nivel',
  expDetailCommunity: 'Comunidad',
  expDetailIncludes: 'Qué incluye',
  expDetailRelated: 'Experiencias Relacionadas',
  expDetailReviews: 'Reseñas',
  expDetailNoReviews: 'Sin reseñas aún. ¡Sé el primero!',
  expDetailAddReview: 'Dejar Reseña',
  expDetailReviewName: 'Tu nombre',
  expDetailReviewText: 'Tu reseña',
  expDetailReviewSubmit: 'Enviar Reseña',

  prodCategoryTitle: 'Productos',
  prodCategoryAll: 'Todos',
  prodDetailAddToCart: 'Agregar al Carrito',
  prodDetailInStock: 'En stock',
  prodDetailOutOfStock: 'Agotado',
  prodDetailRelated: 'Productos Relacionados',
  prodDetailDescription: 'Descripción',

  customerTitle: 'Mi Cuenta',
  customerSubtitle: 'Gestiona tus reservas e información personal',
  customerBookings: 'Mis Reservas',
  customerNoBookings: 'Aún no tienes reservas.',
  customerProfile: 'Perfil',
  customerName: 'Nombre Completo',
  customerPhone: 'Teléfono',
  customerSave: 'Guardar Cambios',
  customerSaved: '¡Perfil actualizado!',
  customerError: 'Error al guardar. Inténtalo de nuevo.',
  customerCancelBooking: 'Cancelar',
  customerCancelConfirm: '¿Estás seguro de que deseas cancelar esta reserva?',
  customerCancelled: 'Reserva cancelada.',
  customerBookingDate: 'Fecha',
  customerBookingType: 'Tipo',
  customerBookingStatus: 'Estado',
  customerBookingNotes: 'Notas',
  customerStatsTotal: 'Total',
  customerStatsConfirmed: 'Confirmadas',
  customerStatsPending: 'Pendientes',
  customerStatusPending: 'Pendiente',
  customerStatusConfirmed: 'Confirmada',
  customerStatusCancelled: 'Cancelada',
  customerTypeExperience: 'Experiencia',
  customerTypeClass: 'Clase',
  customerTypeProduct: 'Producto',
  customerJoinDate: 'Miembro desde',
  customerEmail: 'Correo',

  adminManualBooking: 'Reserva Manual',
  adminManualBookingTitle: 'Crear Reserva Manual',
  adminManualBookingClient: 'Nombre del Cliente',
  adminManualBookingEmail: 'Correo del Cliente',
  adminManualBookingPhone: 'Teléfono',
  adminManualBookingItem: 'Artículo',
  adminManualBookingDate: 'Fecha',
  adminManualBookingNotes: 'Notas',
  adminManualBookingCreate: 'Crear Reserva',
  adminManualBookingCreated: '¡Reserva manual creada!',
  adminCalendar: 'Calendario',
  adminCalendarTitle: 'Calendario de Operaciones',
  adminCalendarToday: 'Hoy',

  installTitle: 'Instala la App',
  installSubtitle: 'Acceso rápido, uso sin internet y notificaciones.',
  installFeature1: 'Acceso instantáneo desde tu pantalla de inicio',
  installFeature2: 'Funciona sin conexión a internet',
  installFeature3: 'Recibe ofertas y novedades',
  installButton: 'Instalar Aplicación',
  installNotNow: 'Ahora no',
  installInstructionsTitle: 'Cómo instalar',
  installIOSSubtitle: 'En Safari, sigue los pasos para añadir a tu pantalla de inicio:',
  installChromeSubtitle: 'En tu navegador, sigue los pasos:',
  installIOSStep1: 'Toca el botón de compartir (ícono con flecha hacia arriba)',
  installIOSStep2: 'Desplaza hacia abajo y selecciona "Añadir a pantalla de inicio"',
  installIOSStep3: 'Confirma tocando "Añadir" en la esquina superior derecha',
  installChromeStep1: 'Toca el menú (tres puntos) en la barra de direcciones',
  installChromeStep2: 'Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"',
  installGotIt: '¡Entendido!',

  galleryLabel: 'Portafolio',
  galleryTitle: 'Galería',
  gallerySubtitle: 'Las mejores imágenes de nuestras expediciones, clases y experiencias en la Amazonía Atlántica.',
  galleryAll: 'Todas',
  galleryViewFull: 'Ver Galería Completa',

  aboutValues: 'Valores Fundamentales',
  aboutValue1Title: 'Seguridad',
  aboutValue1Desc: 'Instructores certificados, equipos de última generación y protocolos rigurosos para garantizar una experiencia segura en cada actividad.',
  aboutValue2Title: 'Respeto por la Naturaleza',
  aboutValue2Desc: 'Turismo de impacto positivo, preservación ambiental y valorización del ecosistema amazónico en cada experiencia que creamos.',
  aboutValue3Title: 'Hospitalidad Amazónica',
  aboutValue3Desc: 'Autenticidad, cálida bienvenida y conexión genuina con las comunidades locales y la cultura paraense.',

  aboutLeadership: 'Liderazgo',
  aboutLeader1Name: 'Pingo',
  aboutLeader1Role: 'Director Técnico',
  aboutLeader2Name: 'Pablo',
  aboutLeader2Role: 'Director de Operaciones',
  aboutLeader3Name: 'Rafael Conceição',
  aboutLeader3Role: 'Director de Experiencia y Marca',

  aboutRegions: 'Áreas de Operación',
  aboutProducts: 'Nuestros Productos',

  chatConversations: 'Conversaciones',
  chatSearchPlaceholder: 'Buscar riders...',
  chatNoConversations: 'Sin conversaciones aún. ¡Busca un rider arriba para empezar!',
  chatStartConvo: 'Iniciar conversación...',
  chatSendMessage: 'Enviar mensaje',
  chatTypeMessage: 'Mensaje...',
  chatOnline: 'En línea',
  chatEmpty: '¡Inicia la conversación! Envía el primer mensaje.',
  friendsTitle: 'Amigos',
  friendsList: 'Amigos',
  friendsRequests: 'Solicitudes',
  friendsFind: 'Encontrar',
  friendsEmpty: 'Sin amigos aún. ¡Ve a "Encontrar" para agregar riders!',
  friendsNoRequests: 'Sin solicitudes pendientes.',
  friendsSearchPlaceholder: 'Buscar riders por nombre...',
  friendsNoResults: 'No se encontraron riders.',
  friendsAdd: 'Agregar',
  friendsPending: 'Pendiente',
  friendsAlreadyFriend: 'Amigo',
  friendsAccept: 'Aceptar',
  friendsReject: 'Rechazar',
  friendsRemove: 'Eliminar',
  friendsRequestSent: 'Solicitud enviada',
  friendsRequestReceived: 'Solicitud recibida',
  notificationsTitle: 'Notificaciones',
  notificationsMarkAll: 'Marcar todo como leído',
  notificationsEmpty: 'Sin notificaciones aún.',
  navCommunity: 'Comunidad',
  communityTitle: 'Comunidad',
  communityEmpty: 'Sin publicaciones aún',
  communityLoginPrompt: 'Inicia sesión para acceder a la comunidad',
  homeStartLabel: 'EMPIEZA AQUÍ',
  homeStartTitle: 'Tu viaje AMZ Wind empieza con un clic',
  homeStartSubtitle: 'Explora experiencias, encuentra trips, conecta con la comunidad y sigue tu perfil en un solo flujo.',
  homeStartExperiences: 'Experiencias',
  homeStartExperiencesDesc: 'Descubre expediciones, clases y aventuras destacadas.',
  homeStartTrips: 'Trips',
  homeStartTripsDesc: 'Mira viajes en grupo y participa de experiencias exclusivas.',
  homeStartCommunity: 'Comunidad',
  homeStartCommunityDesc: 'Comparte momentos, conversa y conoce a otros riders.',
  homeStartProfile: 'Mi perfil',
  homeStartProfileDesc: 'Consulta reservas, viajes y tu presencia en la comunidad.',
  homeStartLogin: 'Entrar',
  homeStartLoginDesc: 'Crea tu cuenta y personaliza tu experiencia AMZ Wind.',
  homeStartGo: 'Abrir',
  shareTitle: 'Compartir',
  shareToChat: 'Compartir en el chat',
  shareConfirm: '¿Compartir publicación?',
  shareSuccess: '¡Compartido con éxito!',
  shareError: 'Error al compartir',
  postComments: 'comentarios',
  postLikes: 'me gusta',
  postShares: 'compartidos',
  feedGlobal: 'Global',
  feedFriends: 'Amigos',
  feedEdited: 'editado',
  feedSaving: 'Guardando...',
  feedSave: 'Guardar',
  feedCancel: 'Cancelar',
  feedConfirmDelete: '¿Eliminar esta publicación?',
  feedLoading: 'Cargando...',
  feedRetry: 'Intentar de nuevo',
  feedEmpty: 'Sin publicaciones aún',
  feedEmptyHint: '¡Sé el primero en compartir una session!',
  feedLoadMore: 'Cargar más',
  feedNoComments: 'Sin comentarios aún.',
  feedWriteComment: 'Escribe un comentario...',
  feedSend: 'Enviar',
  feedComment: 'Comentar',
  feedShare: 'Compartir',
  navTrips: 'Trips',
  tripsTitle: 'Trips',
  tripsEmpty: 'Sin trips disponibles',
  tripsEmptyHint: '¡Próximamente nuevas trips!',
  tripParticipants: 'participantes',
  tripJoined: 'Unierto',
  tripJoin: 'Unirse',
  tripLeave: 'Salir del Trip',
  tripLeaveConfirm: '¿Salir de este viaje?',
  tripFull: 'Lleno',
  tripDetail: 'Viaje',
  tripNotFound: 'Viaje no encontrado',
  tripOrganizedBy: 'Organizado por',
  tripStatusPublished: 'Abierta',
  tripStatusFull: 'Llena',
  tripStatusCancelled: 'Cancelada',
  tripStatusCompleted: 'Completada',
  tripStatusDraft: 'Borrador',
  tripCreate: 'Nueva Trip',
  tripCreateButton: 'Crear Trip',
  tripCreateSuccess: '¡Trip creada con éxito!',
  tripEdit: 'Editar Trip',
  tripSave: 'Guardar',
  tripSaving: 'Guardando...',
  tripSaveSuccess: '¡Guardado con éxito!',
  tripUploading: 'Subiendo portada...',
  tripCoverLabel: 'Portada',
  tripCoverUpload: 'Seleccionar imagen',
  tripCoverTooLarge: 'Imagen demasiado grande. Límite: 10MB',
  tripTitleLabel: 'Título',
  tripTitlePlaceholder: 'Ex: Downwind Maranhão 2026',
  tripDescriptionLabel: 'Descripción',
  tripDescriptionPlaceholder: 'Describe el viaje...',
  tripDestinationLabel: 'Destino',
  tripDestinationPlaceholder: 'Ex: Maranhão, Brasil',
  tripStartDate: 'Fecha inicio',
  tripEndDate: 'Fecha fin',
  tripDateError: 'La fecha final debe ser posterior a la fecha inicial',
  tripMaxParticipantsLabel: 'Máx. participantes',
  tripMaxParticipantsPlaceholder: 'Ex: 12',
  tripMaxParticipantsError: 'Mínimo 2 participantes',
  tripStatusLabel: 'Estado',
  tripInvite: 'Invitar',
  tripInviteFriends: 'Invitar Amigos',
  tripInviteButton: 'Invitar',
  tripInvited: 'Invitado',
  tripNoFriendsToInvite: 'Sin amigos disponibles',
  tripChat: 'Chat',
  tripTabInfo: 'Info',
  tripTabParticipants: 'Personas',
  tripTabFeed: 'Feed',
  tripNoParticipants: 'Sin participantes aún',
  tripRoleOrganizer: 'Organizador',
  tripRoleParticipant: 'Participante',
  tripPending: 'Pendiente',
  tripRemoveConfirm: '¿Eliminar este participante?',
  tripFeedEmpty: 'Sin posts aún',
  tripFeedJoinFirst: 'Únete al viaje para ver el feed',
  tripVisibilityLabel: 'Visibilidad',
  tripVisibilityPublic: 'Pública — aparece en el listado',
  tripVisibilityPrivate: 'Privada — solo participantes ven',

  // FASE 7 — UserProfile
  profileTabProfile: 'Perfil',
  profileTabBookings: 'Mis Reservas',
  profileTabProducts: 'Productos',
  profileTabGallery: 'Galería',
  profileTabTrips: 'Viajes',
  profileTabFeed: 'Feed',
  profileTabFriends: 'Amigos',
  profileTabChat: 'Chat',
  profilePersonalData: 'Datos Personales',
  profileFullName: 'Nombre Completo',
  profileFullNamePlaceholder: 'Tu nombre completo',
  profileBio: 'Bio del Atleta',
  profileBioPlaceholder: 'Cuenta tu historia: desde cuando practicas kitesurf, tus spots favoritos, logros...',
  profileEmail: 'Correo',
  profilePhone: 'Teléfono',
  profilePhonePlaceholder: '(92) 99999-0000',
  profileWhatsApp: 'WhatsApp',
  profileWhatsAppRequired: 'WhatsApp (obligatorio para contacto)',
  profileSaving: 'Guardando...',
  profileSave: 'Guardar Perfil',
  profileMemberSince: 'Miembro desde:',
  profileBack: 'Volver',
  profileStatsBookings: 'Reservas',
  profileStatsConfirmed: 'Confirmadas',
  profileStatsProducts: 'Productos',
  profileStatsReservations: 'reserva(s)',
  profileNoBookings: 'Sin reservas aún',
  profileNoBookingsHint: 'Tus experiencias, clases y downwinds aparecerán aquí',
  profileProductsPhysical: 'Productos Físicos',
  profileProductsCount: 'producto(s)',
  profileNoProducts: 'Sin productos comprados',
  profileNoProductsHint: 'Lycras, sombreros, accesorios y más',
  profileGoToShop: 'Ir a la Tienda',
  profilePurchasedIn: 'Comprado el',
  profileDelivered: 'Producto entregado',
  profilePendingConfirmation: 'Esperando confirmación',
  profileDeliveryStatus: 'Estado de entrega',
  profileSessionsGallery: 'Galería de Sesiones',
  profileSessionsDescription: 'Fotos oficiales tomadas por el equipo de Amazon Wind en tus sesiones. Descarga, comenta y conéctate con otros participantes.',
  profileNoSessions: 'Sin sesiones completadas',
  profileNoSessionsHint: 'Completa una experiencia para acceder a las fotos de la sesión',
  profileSessionCompleted: 'Completada',
  profileGallerySoon: 'La galería estará disponible pronto por el equipo',
  profileTripComments: 'Comentarios del Viaje',
  profileTripCommentsSoon: 'Pronto podrás comentar e interactuar con otros participantes de esta sesión!',
  profileMyTrips: 'Mis Viajes',
  profileMyTripsDescription: 'Viajes que organizaste o en los que participas.',
  profileNoTrips: 'Sin viajes aún',
  profileNoTripsHint: 'Crea o únete a un viaje',
  profileViewTrips: 'Ver Viajes',
  profileStatusDraft: 'Borrador',
  profileStatusPublished: 'Publicado',
  profileStatusFull: 'Lleno',
  profileStatusCancelled: 'Cancelado',
  profileStatusCompleted: 'Completado',
  profileParticipants: 'participantes',
  profileCommunityFeed: 'Feed de la Comunidad',
  profileCommunityFeedDescription: 'Conéctate con otros riders. Comparte tus sesiones, fotos y logros en kitesurf.',
  profileErrorAvatar: 'Error al subir avatar:',
  profileErrorSave: 'Error al guardar:',
  profileSuccessSave: 'Perfil actualizado con éxito!',
  profileBookingTypeExperience: 'Experiencia',
  profileBookingTypeClass: 'Clase',
  profileBookingTypeProduct: 'Producto',

  // FASE 7 — KiteCoursePage
  kiteCourseTitle: 'Clase de Kitesurf Principiante',
  kiteCourseSubtitle: 'Módulo Principiante',
  kiteCourseIncludesTitle: 'Qué está incluido',
  kiteCourseInclude1: '10 clases prácticas (duración total: 30h)',
  kiteCourseInclude2: 'Equipo completo incluido (kite, barra, tabla, chaleco)',
  kiteCourseInclude3: 'Teoría de seguridad y meteorología',
  kiteCourseInclude4: 'Instructor certificado IKO',
  kiteCourseInclude5: 'Seguro de accidente durante las clases',
  kiteCourseInclude6: 'Certificado de finalización del nivel Principiante',
  kiteCourseInclude7: 'Análisis de video de las sesiones',
  kiteCourseInclude8: 'Agua y bocadillos durante las clases',
  kiteCourseModule1Title: 'Módulo 1 — Fundamentos',
  kiteCourseModule1Desc: 'Teoría en la playa, montaje del equipo, primeros vuelos con kite en la arena, control básico de la barra.',
  kiteCourseModule2Title: 'Módulo 2 — Agua',
  kiteCourseModule2Desc: 'Body drag, water start, control en el agua, vuelo asistido por el instructor, primeras maniobras.',
  kiteCourseModule3Title: 'Módulo 3 — Independencia',
  kiteCourseModule3Desc: 'Maniobras básicas autónomas, transición, corte, downwind guiado y análisis de video.',
  kiteCourseTotalHours: '30h totales',
  kiteCourseTotalClasses: 'clases',
  kiteCourseInvestment: 'Inversión',
  kiteCourseInvestmentSummary: '10 clases completas • Equipo incluido • Certificación IKO',
  kiteCourseAbout: 'Sobre el Curso',
  kiteCourseAboutText: 'Nuestro módulo Principiante es el programa completo para quienes quieren aprender kitesurf desde cero. Con 10 clases prácticas distribuidas en 3 módulos progresivos, pasas de la teoría en la playa hasta realizar tus primeras maniobras de forma independiente. Todo el equipo es proporcionado y las clases son impartidas por instructores certificados IKO en las mejores condiciones de viento y agua de la costa amazónica.',
  kiteCourseWhatIncluded: 'Qué está incluido',
  kiteCourseModules: 'Módulos del Curso',
  kiteCourseClasses: 'clases',
  kiteCourseGallery: 'Galería',
  kiteCourseSchedule: 'Agendar Clases',
  kiteCourseScheduleDescription: 'Selecciona las fechas de inicio y fin de tus clases. El calendario de abajo ayuda a planificar tu curso.',
  kiteCourseTotalInvestment: 'Total de la inversión',
  kiteCourseScheduleButton: 'Agendar y Proceder',
  kiteCourseSelectDate: 'Selecciona una fecha',
  kiteCourseReviews: 'Reseñas',
  kiteCourseReviewsEmpty: 'Las reseñas de los alumnos aparecerán aquí después de la finalización de los cursos.',
  kiteCourseVideoSoon: 'Próximamente un vídeo',

  // FASE 7 — ExperienceDetail
  expDetailNotFound: 'Experiencia no encontrada.',
  expDetailPackage: 'Paquete',
  expDetailIndividual: 'Individual',
  expDetailFullPackage: 'Paquete Completo',
  expDetailWhatIncluded: 'Qué está incluido en el paquete',
  expDetailWhatIncludedShort: 'Qué está incluido',
  expDetailPackageTotal: 'Inversión total del paquete',
  expDetailPerPerson: 'por persona',
  expDetailBookingDate: 'Fecha de Reserva',
  expDetailAddToCart: 'Agregar Paquete al Carrito',
  expDetailSecurePayment: 'Pago seguro vía PIX, Tarjeta o PayPal',
  expDetailUserFallback: 'User',

  // FASE 7 — AdminDashboard
  adminAccessDenied: 'Acceso restringido a administradores.',
  adminHeroCover: 'Hero / Portada',
  adminTrips: 'Viajes',
  adminLoadingDashboard: 'Cargando Panel Administrativo...',
  adminPanel: 'Panel Admin',
  adminThemeLight: 'Modo Claro',
  adminThemeDark: 'Modo Oscuro',
  adminCollapse: 'Contraer',
  adminOnline: 'En línea',

  // FASE 7 — Feed components
  feedErrorLoading: 'Error al cargar feed.',
  feedPostError: 'Error al publicar.',
  feedPostTripPlaceholder: 'Publicar en viaje "${tripName}"...',
  feedPostPlaceholder: 'Comparte tu sesión de kite... 🪁',
  feedPostSuccess: 'Publicado con éxito!',
  feedPostMedia: 'Foto/Vídeo',
  feedPostSending: 'Enviando media...',
  feedPostPublishing: 'Publicando...',
  feedPostButton: 'Publicar',
  feedCommentLoading: 'Cargando...',
  feedCommentEmpty: 'Sin comentarios aún.',
  feedCommentPlaceholder: 'Escribe un comentario...',
  feedCommentSend: 'Enviar',
  feedCommentSave: 'Guardar',
  feedCommentCancel: 'Cancelar',
  feedCommentRider: 'Rider',
  feedPostNow: 'ahora',
  feedPostEdited: 'editado',
  feedPostDeleteConfirm: '¿Eliminar esta publicación?',
  feedPostErrorSave: 'Error al guardar',
  feedPostSaving: 'Guardando...',
  feedPostSave: 'Guardar',
  feedPostComment: 'Comentar',
  feedPostShare: 'Compartir',

  // FASE 7 — Chat components
  chatRiderFallback: 'Rider',
  chatDeletedMessage: 'Mensaje eliminado',
  chatMessageFallback: 'Mensaje',
  chatReply: 'Responder',
  chatDelete: 'Eliminar',
  chatCancel: 'Cancelar',
  chatMessagePlaceholder: 'Mensaje...',

  // FASE 7 — ConversationsList
  convRiderFallback: 'Rider',
  convYesterday: 'Ayer',
  convTitle: 'Conversaciones',
  convSearchPlaceholder: 'Buscar riders...',
  convSearching: 'Buscando...',
  convEmpty: 'Sin conversaciones aún. Busca un rider arriba para comenzar!',
  convStartChat: 'Iniciar conversación...',

  // FASE 7 — Community
  communityLoginButton: 'Iniciar',

  // FASE 7 — Notifications
  notificationNow: 'Ahora',
  notificationMin: 'min',
  notificationHour: 'h',
  notificationDay: 'd',

  // FASE 7 — Friends
  friendsRiderFallback: 'Rider',

  // FASE 7 — Products
  productNotFound: 'Producto no encontrado.',
  productAddedToCart: 'Agregado al carrito!',
  productInCart: 'en el carrito',
  productContinueShopping: 'Seguir Comprando',
  productViewCart: 'Ver Carrito',
  productOutOfStock: 'Este producto está agotado momentáneamente.',
  productViewOthers: 'Ver otros productos',

  // FASE 7 — Wishlist
  wishlistAlreadyInCart: 'Este artículo ya está en el carrito',
  wishlistAdded: 'agregado al carrito!',
  wishlistRemoved: 'Eliminado de favoritos',
  wishlistTitle: 'Lista de Deseos',
  wishlistSubtitle: 'Artículos guardados para reserva futura',
  wishlistEmpty: 'Sin favoritos aún',
  wishlistEmptyHint: 'Toca el ícono de corazón en cualquier experiencia o producto para guardarlo aquí.',
  wishlistInCart: '✓ En el Carrito',
  wishlistAddToCart: 'Agregar al Carrito',
  wishlistRemove: 'Eliminar',
  wishlistItem: 'artículo',
  wishlistItems: 'artículos',

  // FASE 7 — Trips (error/status)
  tripErrorLoad: 'Error al cargar viaje',
  tripErrorJoin: 'Error al unirse al viaje',
  tripErrorLeave: 'Error al salir del viaje',
  tripErrorInvite: 'Error al enviar invitación',
  tripErrorRemove: 'Error al eliminar participante',
  tripErrorCreate: 'Error al crear viaje',
  tripErrorSave: 'Error al guardar',
  tripErrorUpload: 'Error en la subida:',
  tripNotAuthenticated: 'No autenticado',
  tripStatusPublic: '🌐 Público',
  tripStatusPrivate: '🔒 Privado',
  tripAgo: 'ahora',

  // FASE 7 — ShareDialog
  shareRiderFallback: 'Rider',
  shareGroupFallback: 'Grupo',
  shareTripFallback: 'Viaje',
  shareConvFallback: 'Conversación',
  shareSent: 'Enviado!',

  // FASE 7 — FavoriteButton
  favRemoveAria: 'Eliminar de favoritos',
  favAddAria: 'Agregar a favoritos',

  // FASE 7 — Header
  headerMenu: 'Menú',
  headerAbout: 'Sobre',
  headerToggleTheme: 'Cambiar tema',
  headerUserFallback: 'Usuario',
  headerMyProfile: 'Mi Perfil',
  headerAdminPanel: 'Panel Admin',
  headerLogin: 'Iniciar',
  headerCart: 'Carrito',

  // FASE 7 — CartCheckout
  checkoutTestimonial1: '¡Experiencia increíble! Todo fue organizado a la perfección. ¡Muy recomendable!',
  checkoutTestimonial2: 'Clase de kite sensacional. Seguridad y diversión al mismo tiempo.',
  checkoutTestimonial3: 'El route de downwind más lindo que hice. ¡Equipo top!',
  checkoutEmpty: 'Explora nuestras experiencias, productos y clases y agrega artículos al carrito para reservar.',
  checkoutEmptyHint: '',
  checkoutSummary: 'Resumen de la Reserva',
  checkoutSubtotal: 'Subtotal',
  checkoutPixDiscount: 'Descuento PIX (5%)',
  checkoutTotal: 'Total',
  checkoutWhatsApp: 'WhatsApp para contacto',
  checkoutFilled: '(completado)',
  checkoutPaymentMethod: 'Forma de Pago',
  checkoutCard: 'Tarjeta',
  checkoutUpTo: 'Hasta 6x',
  checkoutInternational: 'Internacional',
  checkoutPixInstant: 'Aprobación Instantánea',
  checkoutPixDiscountApplied: '5% de descuento aplicado',
  checkoutPixKey: 'Clave PIX (Copiar y Pegar):',
  checkoutPixCopy: 'Copiar Clave PIX',
  checkoutPixCopied: '✓ Copiado!',
  checkoutCardPlaceholder: '0000 0000 0000 0000',
  checkoutCardName: 'Nombre en la tarjeta',
  checkoutInstallments: 'Cuotas',
  checkoutInterestFree: 'sin interés',
  checkoutPaypalTitle: 'Pago con PayPal',
  checkoutPaypalDescription: 'Serás redirigido a PayPal para completar el pago de forma segura.',
  checkoutConfirmPayment: 'Confirmar Pago',
  checkoutTestimonialsTitle: 'Lo que dicen nuestros clientes',
  checkoutSecurePayment: '100% Seguro',
  checkoutEncryptedPayment: 'Pago Cifrado',
  checkoutGuarantee: 'Garantía Amazon Wind',
  checkoutWhatsAppSupport: 'Soporte vía WhatsApp',
  checkoutAddItemFirst: 'Agrega un artículo al carrito primero',
  checkoutWhatsAppRequired: 'Ingresa tu WhatsApp para contacto.',
  checkoutCreateAccount: 'Crear cuenta',
  checkoutItemRemoved: 'Artículo eliminado del carrito',

  // FASE 7 — Splash / ProtectedRoute
  splashSubtitle: 'Kitesurf & Expediciones',
  protectedRouteLoading: 'Verificando credenciales de Amazon Wind...',

  // FASE 7 — Admin components (heroes)
  heroSlideLimit: 'Límite de 6 slides alcanzado. Elimina un slide antes de crear otro.',
  heroMediaRequired: 'Por favor indica o sube el medio de fondo.',
  heroTitleRequired: 'El título es obligatorio.',
  heroSlideUpdated: '¡Slide actualizado con éxito!',
  heroSlideCreated: '¡Slide creado con éxito!',
  heroSlideRemoved: 'Slide oficial eliminado de la visualización.',
  heroSlideDeleted: 'Slide eliminado.',
  heroManageTitle: 'Gestionar Hero / Portada',
  heroManageDescription: 'Controla los medios y textos destacados de la página principal.',
  heroSlideCount: 'Límite de 6 slides alcanzado',
  heroNewSlide: '+ Nuevo Slide',
  heroDimensionTip: 'Sugerencia de dimensiones:',
  heroUploadTip: 'Puedes subir imagen o video.',
  heroLoading: 'Cargando slides...',
  heroNoSlides: 'Sin slides configurados.',
  heroCreateFirst: 'Crear primer slide',
  heroTypeYoutube: 'YouTube',
  heroTypeVideo: 'Video',
  heroTypeImage: 'Imagen',
  heroOfficial: 'Oficial',
  heroCtaPrefix: 'CTA:',
  heroMoveUp: 'Mover arriba',
  heroMoveDown: 'Mover abajo',
  heroEdit: 'Editar',
  heroDelete: 'Eliminar',
  heroEditSlide: 'Editar Slide',
  heroNewSlideTitle: 'Nuevo Slide de Hero',
  heroTitleLabel: 'Título Destacado',
  heroTitlePlaceholder: 'Ej: Expediciones en la Costa Norte',
  heroSubtitleLabel: 'Subtítulo',
  heroSubtitlePlaceholder: 'Ej: Siente la fuerza de los vientos alisios',
  heroMediaTypeLabel: 'Tipo de Medio',
  heroOrderLabel: 'Orden',
  heroUploadLabel: 'Subir Archivo',
  heroUrlLabel: 'O pega el enlace directo (URL)',
  heroUrlPlaceholder: 'https://ejemplo.com/imagen.jpg o enlace de YouTube',
  heroCtaTextLabel: 'Texto del Botón (CTA)',
  heroCtaTextPlaceholder: 'Explorar Rutas',
  heroCtaLinkLabel: 'Enlace del Botón',
  heroCancel: 'Cancelar',
  heroSaving: 'Guardando...',
  heroUpdate: 'Actualizar',
  heroCreate: 'Crear Slide',
  heroDeleteTitle: 'Eliminar Slide',
  heroDeleteConfirm: '¿Estás seguro de que deseas eliminar "${deleteTarget.title}"?',
  heroDeleteYes: 'Sí, Eliminar',

  // FASE 7 — Admin components (bookings)
  bookingUpdated: '¡Reserva actualizada con éxito!',
  bookingDeleted: 'Reserva eliminada.',
  bookingTypeExperience: 'Experiencia',
  bookingTypeClass: 'Clase',
  bookingTypeProduct: 'Producto',
  bookingConfirmAction: '¿Deseas confirmar/cancelar esta reserva?',
  bookingPaid: 'Pago confirmado',
  bookingDetails: 'Detalles de la Reserva',
  bookingClientInfo: 'Información del Cliente',
  bookingFieldName: 'Nombre:',
  bookingFieldEmail: 'Email:',
  bookingFieldWhatsApp: 'WhatsApp:',
  bookingFieldPhone: 'Teléfono:',
  bookingNoContact: 'Sin información de contacto registrada',
  bookingReservationDetails: 'Detalles de la Reserva',
  bookingFieldType: 'Tipo',
  bookingFieldItemId: 'ID del Artículo',
  bookingReservedItems: 'Artículos Reservados',
  bookingStatusPending: 'Pendiente',
  bookingStatusConfirmed: 'Confirmada',
  bookingStatusCancelled: 'Cancelada',
  bookingDate: 'Fecha de Reserva',
  bookingNotes: 'Notas / Observaciones',
  bookingCancel: 'Cancelar',
  bookingDelete: 'Eliminar',
  bookingSaving: 'Guardando...',
  bookingSave: 'Guardar Cambios',
  bookingDeleteTitle: 'Eliminar Reserva',
  bookingDeleteConfirm: '¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.',

  // FASE 7 — Admin components (classes)
  classErrorLoad: 'Error al cargar clases:',
  classErrorUpdate: 'Error al actualizar clase:',
  classUpdated: '¡Clase actualizada con éxito!',
  classErrorCreate: 'Error al crear clase:',
  classCreated: '¡Clase creada con éxito!',
  classErrorDelete: 'Error al eliminar clase:',
  classDeleted: 'Clase eliminada.',
  classLoading: 'Cargando clases...',
  classManageTitle: 'Gestionar Clases',
  classManageDescription: 'Configura los paquetes de clases, medios y precios.',
  classNewButton: '+ Nueva Clase',
  classEmpty: 'Sin clases registradas',
  classEdit: 'Editar',
  classDelete: 'Eliminar',
  classEditTitle: 'Editar Clase',
  classNewTitle: 'Nueva Clase',
  classFieldTitle: 'Título',
  classFieldTitlePlaceholder: 'Ej: Clase Privada de Kite',
  classFieldPrice: 'Precio (R$)',
  classFieldDuration: 'Duración',
  classFieldDurationPlaceholder: 'Ej: 2h30',
  classFieldLevel: 'Nivel',
  classFieldLevelPlaceholder: 'Ej: Principiante / Intermedio',
  classFieldDescription: 'Descripción',
  classFieldImage: 'Imagen Principal de la Clase',
  classFieldVideo: 'Video Promocional (Opcional)',
  classCancel: 'Cancelar',
  classSaving: 'Guardando...',
  classUpdate: 'Actualizar',
  classCreate: 'Crear Clase',
  classDeleteTitle: 'Eliminar Clase',
  classDeleteConfirm: '¿Estás seguro de que deseas eliminar "${deleteTarget.title}"?',

  // FASE 7 — Admin components (about)
  aboutTitleRequired: 'El título es obligatorio.',
  aboutUpdated: '¡Página "Sobre" actualizada!',
  aboutCreated: '¡Página "Sobre" creada!',
  aboutManageTitle: 'Gestionar Página "Sobre"',
  aboutManageDescription: 'Edita el contenido de la página sobre en cada idioma.',
  aboutEditContent: 'Editar Contenido',
  aboutLoading: 'Cargando contenido...',
  aboutMainContent: 'Contenido Principal',
  aboutFieldTitle: 'Título',
  aboutFieldTitlePlaceholder: 'Ej: Sobre Amazon Wind',
  aboutFieldSubtitle: 'Subtítulo',
  aboutFieldSubtitlePlaceholder: 'Ej: Escuela de Kitesurf & Expediciones',
  aboutFieldDescription: 'Descripción',
  aboutFieldDescriptionPlaceholder: 'Historia completa de la empresa...',
  aboutMissionVision: 'Misión & Visión',
  aboutFieldMission: 'Misión',
  aboutFieldMissionPlaceholder: 'Misión de la empresa...',
  aboutFieldVision: 'Visión',
  aboutFieldVisionPlaceholder: 'Visión de la empresa...',
  aboutMedia: 'Medios',
  aboutCoverImage: 'Imagen de Portada',
  aboutCoverUrl: 'O pega la URL de la portada',
  aboutVideoUrl: 'URL del Video (YouTube o enlace directo)',
  aboutGallery: 'Galería',
  aboutGalleryPlaceholder: 'URL de imagen de galería',
  aboutAddButton: '+ Agregar',
  aboutCancel: 'Cancelar',
  aboutSaving: 'Guardando...',
  aboutUpdate: 'Actualizar',
  aboutCreate: 'Crear',
  aboutUnsavedData: 'Datos oficiales (no guardados)',
  aboutLabelTitle: 'Título',
  aboutLabelSubtitle: 'Subtítulo',
  aboutLabelDescription: 'Descripción',
  aboutLabelMission: 'Misión',
  aboutLabelVision: 'Visión',
  aboutLabelMedia: 'Medios',
  aboutLabelCover: 'Portada',
  aboutLabelVideo: 'Video',
  aboutGalleryCount: 'Galería (${count} imágenes)',

  // FASE 7 — Admin components (products)
  productAdminName: 'Producto',
  productAdminPrice: 'Precio',
  productAdminStock: 'Stock',
  productAdminActions: 'Acciones',
  productAdminUnit: ' un.',
  productAdminEdit: 'Editar',
  productAdminDelete: 'Eliminar',
  productAdminCategoryPlaceholder: 'Nombre de nueva categoría',
  productAdminCancel: 'Cancelar',
  productAdminNew: '+ Nuevo',

  // FASE 7 — Admin components (trips)
  tripAdminStatusUpdated: '¡Estado actualizado!',
  tripAdminError: 'Error:',
  tripAdminDeleteConfirm: '¿Estás seguro de que deseas eliminar este viaje?',
  tripAdminDeleted: '¡Viaje eliminado!',
  tripAdminDraft: 'Borrador',
  tripAdminPublished: 'Publicado',
  tripAdminFull: 'Lleno',
  tripAdminCancelled: 'Cancelado',
  tripAdminCompleted: 'Completado',
  tripAdminPublic: 'Público',
  tripAdminPrivate: 'Privado',
  tripAdminAll: 'Todos',
  tripAdminEmpty: 'Sin viajes encontrados',
  tripAdminParticipants: ' participantes',

  // FASE 7 — Admin components (shared)
  sharedStatusPending: 'Pendiente',
  sharedStatusConfirmed: 'Confirmada',
  sharedStatusCancelled: 'Cancelada',
  sharedUploadError: 'No se pudo obtener la URL del archivo.',
  sharedUploading: 'Subiendo...',
  sharedChooseVideo: 'Elegir video',
  sharedChooseImage: 'Elegir imagen',

  // FASE 7 — Admin components (financial)
  financialStatusPending: 'Pendiente',
  financialStatusPaid: 'Pagado',
  financialStatusOverdue: 'Vencido',
  financialTypePayable: 'A Pagar',
  financialTypeReceivable: 'A Cobrar',
  financialCategoryRent: 'Alquiler',
  financialCategoryEquipment: 'Equipamiento',
  financialCategoryMarketing: 'Marketing',
  financialCategorySalaries: 'Salarios',
  financialCategoryServices: 'Servicios',
  financialCategoryOperations: 'Operaciones',
  financialCategoryClasses: 'Ingresos Clases',
  financialCategoryExpeditions: 'Ingresos Expediciones',
  financialCategoryProducts: 'Ingresos Productos',
  financialCategoryOther: 'Otros',
  financialUpdated: '¡Cuenta actualizada!',
  financialCreated: '¡Cuenta creada!',
  financialDeleted: 'Cuenta eliminada.',
  financialSummary: 'Resumen Financiero',
  financialPay: 'Pagar',
  financialReceive: 'Cobrar',
  financialBalance: 'Saldo',
  financialFilters: 'Filtros',
  financialAllTypes: 'Todos los Tipos',
  financialAllStatuses: 'Todos los Estados',
  financialNewEntry: '+ Nuevo Registro',
  financialEntries: 'Registros',
  financialItems: ' artículos',
  financialEmpty: 'Sin registros encontrados',
  financialFieldDescription: 'Descripción',
  financialFieldDescriptionPlaceholder: 'Ej: Alquiler espacio, Clase privada...',
  financialFieldType: 'Tipo',
  financialFieldValue: 'Monto (R$)',
  financialFieldDueDate: 'Vencimiento',
  financialFieldCategory: 'Categoría',
  financialFieldCategoryPlaceholder: 'Seleccionar...',
  financialFieldStatus: 'Estado',
  financialFieldNotes: 'Notas',
  financialFieldNotesPlaceholder: 'Opcional...',
  financialCancel: 'Cancelar',
  financialSaving: 'Guardando...',
  financialUpdate: 'Actualizar',
  financialCreate: 'Crear Cuenta',
  financialDeleteTitle: 'Eliminar Registro',
  financialDeleteConfirm: '¿Estás seguro de que deseas eliminar "${deleteTarget.description}"?',

  // FASE 7 — Admin components (experiences)
  expAdminPackage: 'Paquete',
  expAdminIndividual: 'Individual',
  expAdminItemsIncluded: ' artículos incluidos',
  expAdminTypeLabel: 'Tipo de Experiencia',
  expAdminTypeIndividual: 'Experiencia Individual',
  expAdminTypeIndividualDesc: 'Clase suelta, downwind, etc.',
  expAdminTypePackage: 'Paquete Completo',
  expAdminTypePackageDesc: 'All-Inclusive, curso, etc.',
  expAdminCategoryPlaceholder: 'Nombre de nueva categoría',
  expAdminCancel: 'Cancelar',
  expAdminNew: '+ Nuevo',
  expAdminOriginalPrice: 'Precio Original (referencia, opcional)',
  expAdminOriginalPricePlaceholder: 'Ej: 14500.00 (muestra descuento)',
  expAdminOriginalPriceHelp: 'Si se completa, muestra el precio tachado y el porcentaje de descuento.',
  expAdminIncludedItems: 'Qué está incluido (1 artículo por línea)',
  expAdminIncludedPlaceholder: '10 clases prácticas (30h)\nEquipo completo\nCertificación IKO\nSeguro de accidente\nAgua y bocadillos',
  expAdminIncludedHelp: 'Separa cada artículo por línea...',

  // FASE 7 — Experiencias (landing section)
  expLandingDiscover: 'Descubre',
  expLandingTitle: 'Experiencias & Downwinds',
  expLandingDescription: 'Rutas exclusivas por la Amazonia Atlántica. Cada trayecto es una nueva aventura.',
  expLandingDetails: 'Ver Detalles →',

  // FASE 7 — KiteSchool component
  kiteSchoolAlt: 'Clase de kitesurf',

  // FASE 7 — ContactNewsletter
  contactSendAnother: 'Enviar otro mensaje',

  // FASE 7 — Servicos
  svcWhatsAppRequired: 'Ingresa el número de WhatsApp para contacto.',
  svcDepartureAfterArrival: 'La salida debe ser posterior a la Llegada',

  // FASE 7 — Footer
  footerWhatsApp: 'WhatsApp',

  // FASE 7 — InstallAppBanner
  bannerClose: 'Cerrar',

  // Accessibility aria-labels
  ariaAttach: 'Adjuntar archivo',
  ariaLike: 'Me gusta',
  ariaUnlike: 'No me gusta',

  // Admin — Hero (additional keys)
  heroManageSubtitle: 'Controla los medios y textos destacados de la página de inicio.',
  heroDimensionHelp: 'Puede subir un archivo, pegar un enlace directo (URL) de imagen/video, o pegar un enlace de YouTube — el tipo de medio se detectará automáticamente.',
  heroEmpty: 'Ningún slide configurado.',
  heroBadgeYouTube: 'YouTube',
  heroBadgeVideo: 'Video',
  heroBadgeImage: 'Imagen',
  heroBadgeOfficial: 'Oficial',
  heroCTA: 'CTA: ',
  heroHighlightTitle: 'Título de Destaque',
  heroHighlightPlaceholder: 'Ej: Expediciones en la Costa Norte',
  heroMediaType: 'Tipo de Medio',
  heroOrder: 'Orden',
  heroUploadFile: 'Subir Archivo',
  heroOrPasteUrl: 'O pegue el enlace directo (URL)',
  heroButtonText: 'Texto del Botón',
  heroButtonLink: 'Enlace del Botón',
  heroSaveSlide: 'Crear Slide',
  heroLimitReached: 'Límite de 6 slides alcanzado. Elimine un slide antes de crear otro.',
  heroOfficialRemoved: 'Slide oficial eliminado de la visualización.',

  // Admin — Financial (additional keys)
  finPending: 'Pendiente',
  finPaid: 'Pagado',
  finOverdue: 'Vencido',
  finPayable: 'A Pagar',
  finReceivable: 'A Recibir',
  finAccountUpdated: '¡Cuenta actualizada!',
  finAccountCreated: '¡Cuenta creada!',
  finAccountDeleted: 'Cuenta eliminada.',
  finSummary: 'Resumen Financiero',
  finToPay: 'Pagar',
  finToReceive: 'Recibir',
  finBalance: 'Saldo',
  finReceived: 'Recibido',
  finFilters: 'Filtros',
  finAllTypes: 'Todos los Tipos',
  finAllStatuses: 'Todos los Estados',
  finNewAccount: '+ Nueva Cuenta',
  finTransactions: 'Transacciones',
  finItems: ' elementos',
  finLoading: 'Cargando...',
  finEmpty: 'No se encontraron transacciones',
  finDescription: 'Descripción',
  finType: 'Tipo',
  finCategory: 'Categoría',
  finAmount: 'Valor',
  finDueDate: 'Vencimiento',
  finStatus: 'Estado',
  finActions: 'Acciones',
  finEdit: 'Editar',
  finDelete: 'Eliminar',
  finEditAccount: 'Editar Cuenta',
  finNewAccountTitle: 'Nueva Cuenta',
  finFormType: 'Tipo',
  finFormDescription: 'Descripción',
  finFormDescriptionPlaceholder: 'Ej: Alquiler espacio, Clase particular...',
  finFormAmount: 'Valor (R$)',
  finFormDueDate: 'Vencimiento',
  finFormCategory: 'Categoría',
  finFormSelect: 'Seleccione...',
  finFormStatus: 'Estado',
  finFormNotes: 'Observaciones',
  finFormNotesPlaceholder: 'Opcional...',
  finFormCancel: 'Cancelar',
  finFormSaving: 'Guardando...',
  finFormCreate: 'Crear Cuenta',
  finDeleteTitle: 'Eliminar Transacción',
  finDeleteConfirm: '¿Está seguro de que desea eliminar',
  finCategoryRent: 'Alquiler',
  finCategoryEquipment: 'Equipamiento',
  finCategoryMarketing: 'Marketing',
  finCategorySalaries: 'Salarios',
  finCategoryServices: 'Servicios',
  finCategoryOperational: 'Operativo',
  finCategoryClassRevenue: 'Ingresos Clases',
  finCategoryExpeditionRevenue: 'Ingresos Expediciones',
  finCategoryProductRevenue: 'Ingresos Productos',
  finCategoryOther: 'Otros',

  // Admin — Trips (additional keys)
  tripsAll: 'Todas',
  tripsParticipants: ' participantes',
  tripsDraft: 'Borrador',
  tripsPublished: 'Publicada',
  tripsFull: 'Llena',
  tripsCancelled: 'Cancelada',
  tripsCompleted: 'Completada',
  tripsPublic: 'Pública',
  tripsPrivate: 'Privada',
  tripsStatusUpdated: '¡Estado actualizado!',
  tripsDeleteTitle: 'Eliminar',
  tripsDeleted: '¡Viaje eliminado!',

  // Admin — Classes (additional keys)
  classesTitle: 'Gestionar Clases',
  classesSubtitle: 'Configure los paquetes de clases, medios y precios.',
  classesNew: '+ Nueva Clase',
  classesEmpty: 'No hay clases registradas',
  classesEdit: 'Editar',
  classesDelete: 'Eliminar',
  classesEditTitle: 'Editar Clase',
  classesNewTitle: 'Nueva Clase',
  classesFormTitle: 'Título',
  classesFormTitlePlaceholder: 'Ej: Clase Particular de Kite',
  classesFormPrice: 'Precio (R$)',
  classesFormDuration: 'Duración',
  classesFormDurationPlaceholder: 'Ej: 2h30',
  classesFormLevel: 'Nivel',
  classesFormLevelPlaceholder: 'Ej: Principiante / Intermedio',
  classesFormDescription: 'Descripción',
  classesFormImage: 'Imagen Principal de la Clase',
  classesFormVideo: 'Video Promocional (Opcional)',
  classesCancel: 'Cancelar',
  classesSaving: 'Guardando...',
  classesUpdate: 'Actualizar',
  classesCreate: 'Crear Clase',
  classesDeleteTitle: 'Eliminar Clase',
  classesDeleteConfirm: '¿Está seguro de que desea eliminar',
  classesUpdated: '¡Clase actualizada!',
  classesCreated: '¡Clase creada!',
  classesDeleted: 'Clase eliminada.',
  classesLoadError: 'Error al cargar clases',
  classesUpdateError: 'Error al actualizar clase',
  classesCreateError: 'Error al crear clase',
  classesDeleteError: 'Error al eliminar clase',
  classesLoading: 'Cargando clases...',

  // Admin — About (additional keys)
  aboutTitleLabel: 'Título',
  aboutSubtitleLabel: 'Subtítulo',
  aboutSubtitlePlaceholder: 'Ej: Escuela de Kitesurf & Expediciones',
  aboutDescription: 'Descripción',
  aboutDescriptionPlaceholder: 'Historia completa de la empresa...',
  aboutMissionPlaceholder: 'Misión de la empresa...',
  aboutVisionPlaceholder: 'Visión de la empresa...',
  aboutGalleryAlt: 'Galería ',
  aboutAdd: '+ Agregar',
  aboutUnsaved: 'Datos oficiales (no guardados)',

  // Admin — Products (additional keys)
  prodProduct: 'Producto',
  prodPrice: 'Precio',
  prodStock: 'Stock',
  prodActions: 'Acciones',
  prodUnit: ' ud.',
  prodEdit: 'Editar',
  prodDelete: 'Eliminar',
  prodNewCategory: 'Nombre de nueva categoría',
  prodCancel: 'Cancelar',
  prodNew: '+ Nueva',

  // Admin — Experiences (additional keys)
  expTypePackage: 'Paquete',
  expTypeIndividual: 'Individual',
  expItemsIncluded: ' elementos incluidos',
  expTypeLabel: 'Tipo de Experiencia',
  expTypeIndividualBtn: 'Experiencia Individual',
  expTypeIndividualDesc: 'Clase individual, downwind, etc.',
  expTypePackageBtn: 'Paquete Completo',
  expTypePackageDesc: 'All-Inclusive, curso, etc.',
  expNewCategory: 'Nombre de nueva categoría',
  expCancel: 'Cancelar',
  expNew: '+ Nueva',
  expOriginalPrice: 'Precio Original (referencia, opcional)',
  expOriginalPriceHelp: 'Si se completa, muestra el precio tachado y el porcentaje de descuento.',
  expIncludes: 'Qué está incluido (1 elemento por línea)',
  expIncludesHelp: 'Separe cada elemento por línea. Estos elementos aparecerán en la página de detalles de la experiencia.',

  // Admin — Bookings (additional keys)
  bookingGuest: 'Guest',
  bookingPaymentConfirmed: 'Pago confirmado',
  bookingName: 'Nombre:',
  bookingEmail: 'Email:',
  bookingWhatsApp: 'WhatsApp:',
  bookingPhone: 'Teléfono:',
  bookingStatusLabel: 'Estado',
  bookingDateLabel: 'Fecha de la Reserva',

  // Admin — Shared (additional keys)
  sharedPending: 'Pendiente',
  sharedConfirmed: 'Confirmada',
  sharedCancelled: 'Cancelada',
  sharedSending: 'Enviando...',

  // Admin — Reviews (additional keys)
  reviewUser: 'User',
  reviewDeleted: 'Reseña eliminada',
}

export const translations: Record<Locale, TranslationKeys> = { pt, en, es }

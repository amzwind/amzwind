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

  cartTitle: 'Lista de Desejos & Checkout',
  cartEmpty: 'Sua lista de desejos está vazia',
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
  cartItemCount: 'itens na lista',
  cartMyBookings: 'Minhas Reservas',
  navHome: 'Início',
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

  cartTitle: 'Wishlist & Checkout',
  cartEmpty: 'Your wishlist is empty',
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
  cartItemCount: 'items in wishlist',
  cartMyBookings: 'My Bookings',
  navHome: 'Home',
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

  cartTitle: 'Lista de Deseos & Checkout',
  cartEmpty: 'Tu lista de deseos está vacía',
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
  cartItemCount: 'artículos en la lista',
  cartMyBookings: 'Mis Reservas',
  navHome: 'Inicio',
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
}

export const translations: Record<Locale, TranslationKeys> = { pt, en, es }

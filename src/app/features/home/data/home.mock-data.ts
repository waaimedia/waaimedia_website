import {
  HomeCard,
  HomeContactInfo,
  HomeHeroSlide,
  HomeService,
  HomeStat,
  HomeTeamMember,
} from '../models/home.models';

const both = (en: string, ar: string) => ({ en, ar });

export const HOME_HERO_SLIDES: readonly HomeHeroSlide[] = [
  {
    id: 'media-expo',
    title: both('Waai Media Highlights', 'أبرز محطات وعي ميديا'),
    description: both(
      'Waai Media proudly participated in Futon Media Expo in Turkey, strengthening its regional presence and building partnerships with top media.',
      'شاركت وعي ميديا بفخر في معرض فوتون ميديا في تركيا، لتعزيز حضورها الإقليمي وبناء شراكات مع أبرز الجهات الإعلامية.',
    ),
    imageUrl: null,
    ctaLabel: both('Explore', 'اكتشف'),
    ctaUrl: '/portfolio',
  },
  {
    id: 'brand-stories',
    title: both('Stories That Move Brands', 'قصص تحرك العلامات التجارية'),
    description: both(
      'Creative campaigns and media experiences made to connect people with brands.',
      'حملات إبداعية وتجارب إعلامية تربط الناس بالعلامات التجارية.',
    ),
    imageUrl: null,
    ctaLabel: both('Explore', 'اكتشف'),
    ctaUrl: '/portfolio',
  },
  {
    id: 'next-campaign',
    title: both('Made for Meaningful Reach', 'وصول يصنع أثراً'),
    description: both(
      'Thoughtful strategy, content, and activation for ambitious businesses.',
      'استراتيجية ومحتوى وتفعيل مدروس للأعمال الطموحة.',
    ),
    imageUrl: null,
    ctaLabel: both('Explore', 'اكتشف'),
    ctaUrl: '/portfolio',
  },
];

export const HOME_STATS: readonly HomeStat[] = [
  { id: 'clients', value: '15+', label: both('Clients Served', 'عميلًا') },
  { id: 'campaigns', value: '400+', label: both('Campaigns Launched', 'حملة') },
  { id: 'content', value: '2,000+', label: both('Social Content Published', 'محتوى منشور') },
  { id: 'influencers', value: '18+', label: both('Influencers Covered', 'مؤثرًا') },
  { id: 'events', value: '10+', label: both('Marketing Events', 'فعالية') },
];
export const HOME_SERVICES: readonly HomeService[] = [
      {
      title: 'Digital Marketing Strategy',
      titleAr: 'استراتيجية التسويق الرقمي',
      description: 'We craft tailored strategies that fit your business goals, analyze your market, and help you stand out from the competition.',
      descriptionAr: 'نصمم استراتيجيات مخصصة حول أهداف عملك، ونحلل السوق، ونساعدك على التميز عن المنافسين.',
      icon: '/images/icons/strategy.svg',
    },
    {
      title: 'Social Media Management',
      titleAr: 'إدارة وسائل التواصل الاجتماعي',
      description: 'From content creation to community engagement, we handle your social platforms to grow your brand presence and connect with your audience.',
      descriptionAr: 'من صناعة المحتوى إلى التفاعل مع الجمهور، ندير منصاتك لتعزيز حضور علامتك وبناء مجتمع متفاعل.',
      icon: '/images/icons/users-cog.svg',
    },
    {
      title: 'Content Creation',
      titleAr: 'صناعة المحتوى',
      description: 'Creative visuals, engaging videos, and compelling copy that speak your brand’s voice and capture attention.',
      descriptionAr: 'مرئيات إبداعية، وفيديوهات جذابة، وكتابة مؤثرة تعبّر عن صوت علامتك.',
      icon: '/images/icons/file-check.svg',
    },
    {
      title: 'Performance Marketing (Paid Ads)',
      titleAr: 'التسويق بالأداء (الإعلانات الممولة)',
      description: 'Maximize ROI with data driven campaigns on Facebook, Instagram, Google & more designed to convert clicks into customers.',
      descriptionAr: 'نعظم العائد من خلال حملات مدفوعة مدعومة بالبيانات على فيسبوك، إنستجرام، جوجل وغيرها لتحويل التفاعل إلى عملاء.',
      icon: '/images/icons/target.svg',
    },
    {
      title: 'Branding & Identity',
      titleAr: 'العلامة التجارية والهوية البصرية',
      description: 'We build brands that people love from logos and color palettes to full visual identities.',
      descriptionAr: 'نصنع علامات تجارية يحبها الجمهور من الشعار والألوان إلى هوية بصرية متكاملة.',
      icon: '/images/icons/identity.svg',
    },
    {
      title: 'Web Design & Development',
      titleAr: 'تصميم وتطوير المواقع الإلكترونية',
      description: 'Modern, responsive websites designed to showcase your brand, generate leads, and drive growth.',
      descriptionAr: 'مواقع حديثة ومتجاوبة تظهر علامتك باحترافية، وتولد العملاء المحتملين، وتدفع عجلة النمو.',
      icon: '/images/icons/code-xml.svg',
    },
];
export const HOME_PORTFOLIO: readonly HomeCard[] = [
  {
    id: 'launch',
    category: both('Social Media campaign', 'حملة تواصل اجتماعي'),
    title: both('Product launch campaigns with influencers', 'حملات إطلاق المنتج مع المؤثرين'),
    imageUrl: null,
    tone: 'launch',
  },
  {
    id: 'production',
    category: both('Media Production', 'إنتاج مرئي'),
    title: both('Motion graphics and commercial promo videos', 'رسوم متحركة وإعلانات تجارية'),
    imageUrl: null,
    tone: 'production',
  },
  {
    id: 'activation',
    category: both('PR', 'علاقات عامة'),
    title: both('Live product sampling and activation booths', 'تجارب وتفعيلات مباشرة للمنتج'),
    imageUrl: null,
    tone: 'activation',
  },
];
export const HOME_BRANDS: readonly HomeCard[] = [
  'Krooz',
  'SAMAH ELKASEM',
  'Damaskino',
  'ALSALAMA',
  'RAY Mohamed',
  'FIORE',
].map((name, index) => ({
  id: `brand-${index}`,
  title: both(name, name),
  imageUrl: null,
  tone: `brand-${index}`,
}));
export const HOME_EVENTS: readonly HomeCard[] = [
  {
    id: 'expo',
    category: both('Exhibiting & Hospitality', 'معارض وضيافة'),
    title: both('Future Media Expo', 'Future Media Expo'),
    description: both('Istanbul, Turkey', 'إسطنبول، تركيا'),
    imageUrl: null,
    tone: 'event-one',
  },
  {
    id: 'campaign',
    category: both('Marketing & Next Expo', 'تسويق ومعرض'),
    title: both('Activating Campaign', 'حملة تفعيلية'),
    description: both('Cairo, Egypt', 'القاهرة، مصر'),
    imageUrl: null,
    tone: 'event-two',
  },
  {
    id: 'awards',
    category: both('Attending & Networking', 'حضور وشبكات'),
    title: both('Year-End Marketing Awards', 'جوائز التسويق السنوية'),
    description: both('Dubai, UAE', 'دبي، الإمارات'),
    imageUrl: null,
    tone: 'event-three',
  },
];
export const HOME_BLOGS: readonly HomeCard[] = [
  {
    id: 'trends',
    category: both('Digital Marketing Trends', 'اتجاهات التسويق الرقمي'),
    title: both('What’s Next in Digital Marketing', 'ما القادم في التسويق الرقمي؟'),
    description: both(
      'Stay ahead of the curve. In this section, we break down the latest trends in digital marketing.',
      'رؤى عملية تساعد علامتك على النمو بثقة.',
    ),
    imageUrl: null,
    tone: 'blog-one',
  },
  {
    id: 'case',
    category: both('Case Studies', 'دراسات حالة'),
    title: both('Real Stories. Real Results.', 'قصص حقيقية ونتائج حقيقية.'),
    description: both(
      'Real strategies. Real numbers. Real results. Here, we reveal how campaigns were planned.',
      'تعرف إلى كيف تصنع الحملات المركزة تقدمًا قابلًا للقياس.',
    ),
    imageUrl: null,
    tone: 'blog-two',
  },
  {
    id: 'guide',
    category: both('Tips & Guides', 'نصائح وأدلة'),
    title: both('Your Marketing Playbook', 'دليلك التسويقي'),
    description: both(
      'Actionable advice you can implement today. From ad optimization to social media growth.',
      'إرشادات عملية لقرارات رقمية أقوى.',
    ),
    imageUrl: null,
    tone: 'blog-three',
  },
];
export const HOME_TEAM: readonly HomeTeamMember[] = [
  {
    id: 'ganna',
    name: both('Ganna Elgamal', 'جنة الجمال'),
    role: both('CEO', 'المديرة التنفيذية'),
    imageUrl: null,
    tone: 'avatar-one',
  },
  {
    id: 'hagar',
    name: both('Hagar Ahmed', 'هاجر أحمد'),
    role: both('HR', 'الموارد البشرية'),
    imageUrl: null,
    tone: 'avatar-two',
  },
  {
    id: 'shahd',
    name: both('Shahd Hossam', 'شهد حسام'),
    role: both('Account Manager', 'مديرة حساب'),
    imageUrl: null,
    tone: 'avatar-three',
  },
  {
    id: 'noura',
    name: both('Noura Ali', 'نورا علي'),
    role: both('Graphic Designer', 'مصممة جرافيك'),
    imageUrl: null,
    tone: 'avatar-four',
  },
  {
    id: 'mohamed',
    name: both('Mohamed Zantout', 'محمد زنتوت'),
    role: both('Videographer', 'مصور فيديو'),
    imageUrl: null,
    tone: 'avatar-five',
  },
  {
    id: 'dena',
    name: both('Dena Youssef', 'دينا يوسف'),
    role: both('Moderator', 'مديرة المجتمع'),
    imageUrl: null,
    tone: 'avatar-six',
  },
];
export const HOME_CONTACT: readonly HomeContactInfo[] = [
  { labelKey: 'contactAddress', valueKey: 'contactAddressValue', icon: 'location.svg' },
  { labelKey: 'contactPhones', valueKey: 'contactPhoneValue', icon: 'phone.svg' },
  { labelKey: 'contactEmail', valueKey: 'contactEmailValue', icon: 'email.svg' },
  { labelKey: 'contactHours', valueKey: 'contactHoursValue', icon: 'clock.svg' },
];

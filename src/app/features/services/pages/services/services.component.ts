import { Component, effect, inject } from '@angular/core';
import { LocaleService } from '../../../../core/i18n/locale.service';
import { SeoService } from '../../../../core/seo/seo.service';

interface Service {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly seo = inject(SeoService);

  protected readonly services: Service[] = [
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
    {
      title: 'Media Partner',
      titleAr: 'الشراكات الإعلامية',
      description: 'Strong collaborations with top media outlets to maximize your exposure and reach the right audience.',
      descriptionAr: 'تعاونات قوية مع أبرز المنصات الإعلامية لتعزيز ظهورك والوصول إلى الجمهور المستهدف بفعالية.',
      icon: '/images/icons/partener.svg',
    },
    {
      title: 'Public Relations (PR)',
      titleAr: 'العلاقات العامة (PR)',
      description: 'Crafting impactful communication strategies that shape your image and strengthen your reputation.',
      descriptionAr: 'نصمم استراتيجيات تواصل مؤثرة تعزز صورتك وتدعم سمعتك أمام الجمهور والشركاء.',
      icon: '/images/icons/public-relation.svg',
    },
    {
      title: 'Events & Activations',
      titleAr: 'الفعاليات والتفعيل',
      description: 'Planning and executing memorable events that bring your brand to life and connect you with your audience.',
      descriptionAr: 'نخطط وننفذ فعاليات مميزة تحيي علامتك وتبني تواصلاً مباشراً مع جمهورك.',
      icon: '/images/icons/events.svg',
    },
    {
      title: 'Openings & Launches',
      titleAr: 'الافتتاحات والإطلاقات',
      description: 'Organizing exclusive openings and product launches that leave a lasting first impression.',
      descriptionAr: 'نقدم تنظيماً احترافياً لافتتاحات حصرية وإطلاق المنتجات بما يضمن انطباعاً أولاً لا يُنسى.',
      icon: '/images/icons/opening.svg',
    },
  ];

  constructor() {
    effect(() => {
      const locale = this.i18n.locale();
      const translations = this.i18n.translations();

      this.seo.update({
        title: `${translations.servicesTitle} | ${translations.brandName}`,
        description: translations.servicesPageDescription,
        locale,
        canonicalPath: `/${locale}/services`,
        alternatePaths: { en: '/en/services', ar: '/ar/services' },
        imageUrl: '/images/services.png',
      });
    });
  }
}

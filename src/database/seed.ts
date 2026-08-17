import 'dotenv/config';
import { enumData } from '@/common/constanst/enumData';
import {
  MusicBackgroundEntity,
  ServicePlanEntity,
  TemplateCardTypeEntity,
  TemplateEntity,
} from '@/entities';
import { dataSource } from '@/typeorm/typeorm.config';
import { defaultThemeLayout } from '@/utils/invitation.utils';
import { v4 as uuidv4 } from 'uuid';

const SERVICE_PLANS = [
  {
    name: 'Free',
    priceVnd: 0,
    maxInvitations: 1,
    maxGuests: 50,
    maxPhotos: 20,
    durationDays: 365,
    hasAi: false,
    hasAnalytics: false,
    hasCustomSlug: false,
  },
  {
    name: 'Pro',
    priceVnd: 99000,
    maxInvitations: 3,
    maxGuests: 200,
    maxPhotos: 100,
    durationDays: 365,
    hasAi: false,
    hasAnalytics: true,
    hasCustomSlug: true,
  },
  {
    name: 'Premium',
    priceVnd: 199000,
    maxInvitations: 10,
    maxGuests: 500,
    maxPhotos: 300,
    durationDays: 365,
    hasAi: true,
    hasAnalytics: true,
    hasCustomSlug: true,
  },
];

const TEMPLATE_CARD_TYPES: Record<string, string[]> = {
  BOHO_FLORAL_BROWN: [enumData.CARD_TYPE.WEDDING.code],
  BOHO_FLORAL_GREEN: [enumData.CARD_TYPE.WEDDING.code],
  BOHO_FLORAL_PINK: [enumData.CARD_TYPE.WEDDING.code],
  DRAGON_PHOENIX_RED: [enumData.CARD_TYPE.WEDDING.code],
  RED_DOUBLE_HAPPINESS: [enumData.CARD_TYPE.WEDDING.code],
  ROYAL_RED: [enumData.CARD_TYPE.WEDDING.code],
  BIRTHDAY_CORAL: [enumData.CARD_TYPE.BIRTHDAY.code],
  GRAD_NAVY: [enumData.CARD_TYPE.GRADUATION.code],
  BABY_BLUSH: [enumData.CARD_TYPE.BABY.code],
  CUSTOM_DESIGN: [
    enumData.CARD_TYPE.WEDDING.code,
    enumData.CARD_TYPE.BIRTHDAY.code,
    enumData.CARD_TYPE.GRADUATION.code,
    enumData.CARD_TYPE.BABY.code,
    enumData.CARD_TYPE.HOUSEWARMING.code,
    enumData.CARD_TYPE.ANNIVERSARY.code,
    enumData.CARD_TYPE.CUSTOM.code,
  ],
};

const PREMIUM_THEMES = new Set([
  'DRAGON_PHOENIX_RED',
  'RED_DOUBLE_HAPPINESS',
  'ROYAL_RED',
]);

const MUSIC_SAMPLES = [
  {
    name: 'Canon in D',
    author: 'Pachelbel',
    duration: '5:20',
    audioUrl:
      'https://res.cloudinary.com/demo/video/upload/sample-audio.mp3',
  },
  {
    name: 'A Thousand Years',
    author: 'Christina Perri',
    duration: '4:45',
    audioUrl:
      'https://res.cloudinary.com/demo/video/upload/sample-audio.mp3',
  },
  {
    name: 'Perfect',
    author: 'Ed Sheeran',
    duration: '4:23',
    audioUrl:
      'https://res.cloudinary.com/demo/video/upload/sample-audio.mp3',
  },
];

const SEED_THEME_CODES = [
  'BOHO_FLORAL_BROWN',
  'BOHO_FLORAL_GREEN',
  'BOHO_FLORAL_PINK',
  'DRAGON_PHOENIX_RED',
  'RED_DOUBLE_HAPPINESS',
  'ROYAL_RED',
  'BIRTHDAY_CORAL',
  'GRAD_NAVY',
  'BABY_BLUSH',
  'CUSTOM_DESIGN',
] as const;

function buildThemeLayout(cardTypes: string[]) {
  const primaryCardType = cardTypes[0];
  let sectionOrder = defaultThemeLayout();

  if (primaryCardType === enumData.CARD_TYPE.BIRTHDAY.code) {
    sectionOrder = [
      'hero',
      'divider',
      'hosts',
      'intro',
      'countdown',
      'gallery',
      'partyInfo',
      'timeline',
      'rsvp',
      'map',
      'guestbook',
      'giftBox',
      'thankYou',
    ];
  } else if (primaryCardType === enumData.CARD_TYPE.GRADUATION.code) {
    sectionOrder = [
      'hero',
      'divider',
      'hosts',
      'intro',
      'ceremonies',
      'countdown',
      'gallery',
      'timeline',
      'rsvp',
      'map',
      'guestbook',
      'thankYou',
    ];
  }

  return {
    envelopeStyle: 'classic',
    heroStyle: 'single',
    sectionOrder,
  };
}

async function seedServicePlans() {
  const repo = dataSource.getRepository(ServicePlanEntity);
  const planIds: Record<string, string> = {};

  for (const plan of SERVICE_PLANS) {
    let entity = await repo.findOne({
      where: { name: plan.name, isDeleted: false },
    });

    if (!entity) {
      entity = repo.create({
        id: uuidv4(),
        ...plan,
        isActive: true,
      });
      await repo.save(entity);
      console.log(`Created service plan: ${plan.name}`);
    } else {
      entity.priceVnd = plan.priceVnd;
      entity.maxInvitations = plan.maxInvitations;
      entity.maxGuests = plan.maxGuests;
      entity.maxPhotos = plan.maxPhotos;
      entity.durationDays = plan.durationDays;
      entity.hasAi = plan.hasAi;
      entity.hasAnalytics = plan.hasAnalytics;
      entity.hasCustomSlug = plan.hasCustomSlug;
      entity.isActive = true;
      await repo.save(entity);
      console.log(`Updated service plan: ${plan.name}`);
    }

    planIds[plan.name] = entity.id;
  }

  return planIds;
}

async function seedTemplates(planIds: Record<string, string>) {
  const templateRepo = dataSource.getRepository(TemplateEntity);
  const cardTypeRepo = dataSource.getRepository(TemplateCardTypeEntity);

  for (const themeCode of SEED_THEME_CODES) {
    const theme = enumData.THEME_CODE[themeCode];
    if (!theme) continue;

    const cardTypes = TEMPLATE_CARD_TYPES[themeCode] || [
      enumData.CARD_TYPE.WEDDING.code,
    ];
    const isCustomDesign = themeCode === 'CUSTOM_DESIGN';
    const isPremium = PREMIUM_THEMES.has(themeCode);

    let template = await templateRepo.findOne({
      where: { slug: theme.slug, isDeleted: false },
    });

    if (!template) {
      template = templateRepo.create({
        id: uuidv4(),
        name: theme.name,
        description: `Mẫu giao diện ${theme.name}`,
        slug: theme.slug,
        themeCode: theme.code,
        tags: [themeCode.toLowerCase()],
        isShow: !isCustomDesign,
        isPremium,
        minPlanId: isPremium ? planIds.Pro : undefined,
        trialDays: 3,
        viewCount: 0,
        previewCount: 0,
        themeLayout: buildThemeLayout(cardTypes),
      });
      await templateRepo.save(template);
      console.log(`Created template: ${theme.name}`);
    } else {
      template.name = theme.name;
      template.themeCode = theme.code;
      template.isPremium = isPremium;
      template.minPlanId = isPremium ? planIds.Pro : undefined;
      if (isCustomDesign) template.isShow = false;
      template.themeLayout =
        template.themeLayout || buildThemeLayout(cardTypes);
      await templateRepo.save(template);
      console.log(`Updated template: ${theme.name}`);
    }

    await cardTypeRepo.delete({ templateId: template.id });
    for (const cardType of cardTypes) {
      const row = cardTypeRepo.create({
        id: uuidv4(),
        templateId: template.id,
        cardType,
      });
      await cardTypeRepo.save(row);
    }
  }
}

async function seedMusicBackgrounds() {
  const repo = dataSource.getRepository(MusicBackgroundEntity);

  for (const sample of MUSIC_SAMPLES) {
    const existing = await repo.findOne({
      where: { name: sample.name, isDeleted: false },
    });

    if (existing) {
      existing.author = sample.author;
      existing.duration = sample.duration;
      existing.audioUrl = sample.audioUrl;
      existing.isActive = true;
      existing.status = enumData.MUSIC_PROCESS_STATUS.COMPLETED.code;
      existing.type = 'admin';
      await repo.save(existing);
      console.log(`Updated music: ${sample.name}`);
      continue;
    }

    const entity = repo.create({
      id: uuidv4(),
      name: sample.name,
      author: sample.author,
      duration: sample.duration,
      audioUrl: sample.audioUrl,
      usageCount: 0,
      isActive: true,
      status: enumData.MUSIC_PROCESS_STATUS.COMPLETED.code,
      type: 'admin',
    });
    await repo.save(entity);
    console.log(`Created music: ${sample.name}`);
  }
}

async function seed() {
  console.log('Starting database seed...\n');

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const planIds = await seedServicePlans();
    await seedTemplates(planIds);
    await seedMusicBackgrounds();

    console.log('\nSeed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void seed();

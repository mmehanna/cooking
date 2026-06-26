import { Component } from '@angular/core';

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
  gradient: string;
}

interface SchemaStep {
  label: string;
  desc: string;
}

interface SchemaItem {
  icon: string;
  title: string;
  steps: SchemaStep[];
  gradient: string;
  accent: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss']
})
export class HelpPage {
  featuresGeneral: FeatureItem[] = [
    { icon: 'home-outline', title: 'HELP.ITEMS.LANDING.TITLE', desc: 'HELP.ITEMS.LANDING.DESC', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { icon: 'fast-food-outline', title: 'HELP.ITEMS.MANAGE_PLATES.TITLE', desc: 'HELP.ITEMS.MANAGE_PLATES.DESC', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { icon: 'people-outline', title: 'HELP.ITEMS.FAMILY.TITLE', desc: 'HELP.ITEMS.FAMILY.DESC', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { icon: 'share-social-outline', title: 'HELP.ITEMS.SHARED_PLATES.TITLE', desc: 'HELP.ITEMS.SHARED_PLATES.DESC', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  ];

  featuresLists: FeatureItem[] = [
    { icon: 'cart-outline', title: 'HELP.ITEMS.GROCERY.TITLE', desc: 'HELP.ITEMS.GROCERY.DESC', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    { icon: 'calendar-outline', title: 'HELP.ITEMS.WEEK_PLANNING.TITLE', desc: 'HELP.ITEMS.WEEK_PLANNING.DESC', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ];

  featuresAccount: FeatureItem[] = [
    { icon: 'settings-outline', title: 'HELP.ITEMS.SETTINGS.TITLE', desc: 'HELP.ITEMS.SETTINGS.DESC', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
    { icon: 'diamond-outline', title: 'HELP.ITEMS.SUBSCRIPTION.TITLE', desc: 'HELP.ITEMS.SUBSCRIPTION.DESC', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  ];

  schemas: SchemaItem[] = [
    {
      icon: 'restaurant-outline',
      title: 'HELP.SCHEMAS.CREATE_PLATE.TITLE',
      steps: [
        { label: 'HELP.SCHEMAS.CREATE_PLATE.STEP1.LABEL', desc: 'HELP.SCHEMAS.CREATE_PLATE.STEP1.DESC' },
        { label: 'HELP.SCHEMAS.CREATE_PLATE.STEP2.LABEL', desc: 'HELP.SCHEMAS.CREATE_PLATE.STEP2.DESC' },
        { label: 'HELP.SCHEMAS.CREATE_PLATE.STEP3.LABEL', desc: 'HELP.SCHEMAS.CREATE_PLATE.STEP3.DESC' },
        { label: 'HELP.SCHEMAS.CREATE_PLATE.STEP4.LABEL', desc: 'HELP.SCHEMAS.CREATE_PLATE.STEP4.DESC' },
      ],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#667eea',
    },
    {
      icon: 'calendar-outline',
      title: 'HELP.SCHEMAS.CHEF_WEEK.TITLE',
      steps: [
        { label: 'HELP.SCHEMAS.CHEF_WEEK.STEP1.LABEL', desc: 'HELP.SCHEMAS.CHEF_WEEK.STEP1.DESC' },
        { label: 'HELP.SCHEMAS.CHEF_WEEK.STEP2.LABEL', desc: 'HELP.SCHEMAS.CHEF_WEEK.STEP2.DESC' },
        { label: 'HELP.SCHEMAS.CHEF_WEEK.STEP3.LABEL', desc: 'HELP.SCHEMAS.CHEF_WEEK.STEP3.DESC' },
        { label: 'HELP.SCHEMAS.CHEF_WEEK.STEP4.LABEL', desc: 'HELP.SCHEMAS.CHEF_WEEK.STEP4.DESC' },
      ],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: '#f5576c',
    },
    {
      icon: 'people-outline',
      title: 'HELP.SCHEMAS.FAMILY.TITLE',
      steps: [
        { label: 'HELP.SCHEMAS.FAMILY.STEP1.LABEL', desc: 'HELP.SCHEMAS.FAMILY.STEP1.DESC' },
        { label: 'HELP.SCHEMAS.FAMILY.STEP2.LABEL', desc: 'HELP.SCHEMAS.FAMILY.STEP2.DESC' },
        { label: 'HELP.SCHEMAS.FAMILY.STEP3.LABEL', desc: 'HELP.SCHEMAS.FAMILY.STEP3.DESC' },
        { label: 'HELP.SCHEMAS.FAMILY.STEP4.LABEL', desc: 'HELP.SCHEMAS.FAMILY.STEP4.DESC' },
      ],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      accent: '#4facfe',
    },
    {
      icon: 'cart-outline',
      title: 'HELP.SCHEMAS.GROCERY.TITLE',
      steps: [
        { label: 'HELP.SCHEMAS.GROCERY.STEP1.LABEL', desc: 'HELP.SCHEMAS.GROCERY.STEP1.DESC' },
        { label: 'HELP.SCHEMAS.GROCERY.STEP2.LABEL', desc: 'HELP.SCHEMAS.GROCERY.STEP2.DESC' },
        { label: 'HELP.SCHEMAS.GROCERY.STEP3.LABEL', desc: 'HELP.SCHEMAS.GROCERY.STEP3.DESC' },
      ],
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      accent: '#43e97b',
    },
  ];
}

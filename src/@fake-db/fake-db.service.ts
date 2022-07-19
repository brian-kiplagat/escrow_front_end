import { InMemoryDbService } from 'angular-in-memory-web-api';

import { accountSettingsFakeData } from '@fake-db/account-settings.data';
import { BlogFakeData } from '@fake-db/blog.data';
import { CardAnalyticsData } from '@fake-db/card-analytics.data';
import { CardStatisticsData } from '@fake-db/card-statistics.data';
import { ChatWidgetFakeData } from '@fake-db/chat-widget.data';
import { DashboardFakeData } from '@fake-db/dashboard.data';
import { EcommerceFakeData } from '@fake-db/ecommerce.data';
import { FAQFakeData } from '@fake-db/faq.data';
import { KBFakeData } from '@fake-db/knowledge-base.data';
import { PricingFakeData } from '@fake-db/pricing.data';
import { ProfileFakeData } from '@fake-db/profile.data';
import { SearchFakeData } from '@fake-db/search.data';
import { TodoFakeData } from '@fake-db/todo.data';

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {


      // Account Settings
      'account-settings-data': accountSettingsFakeData.data,

      // Knowledge Base
      'knowledge-base-data': KBFakeData.data,

      // Faq
      'faq-data': FAQFakeData.data,

      // Pricing
      'pricing-data': PricingFakeData.data,

      // Blog
      'blog-data': BlogFakeData.data,

      // Profile
      'profile-data': ProfileFakeData.data,

      // Card Statistics
      'card-statistics-data': CardStatisticsData.data,

      // Card Analytics
      'card-analytics-data': CardAnalyticsData.data,


      // Todo
      'todos-data': TodoFakeData.tasks,
      'todos-assignee': TodoFakeData.assignee,
      'todos-filters': TodoFakeData.filters,
      'todos-tags': TodoFakeData.tags,

      // E-Commerce
      'ecommerce-products': EcommerceFakeData.products,
      'ecommerce-relatedProducts': EcommerceFakeData.relatedProducts,
      'ecommerce-userWishlist': EcommerceFakeData.userWishlist,
      'ecommerce-userCart': EcommerceFakeData.userCart,


      // Chat Widget
      'chat-widget-data': ChatWidgetFakeData.data,

      // Search
      'search-data': SearchFakeData.search,


      // Dashboard
      'dashboard-data': DashboardFakeData.data
    };
  }
}

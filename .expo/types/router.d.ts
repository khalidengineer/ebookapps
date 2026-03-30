/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/categories` | `/(tabs)/quiz` | `/(tabs)/recently-viewed` | `/(tabs)/saved` | `/(tabs)/settings` | `/_sitemap` | `/about` | `/categories` | `/onboarding` | `/pdf-viewer` | `/quiz` | `/quiz/bookmarks` | `/quiz/result` | `/quiz\all` | `/recently-viewed` | `/saved` | `/settings` | `/support`;
      DynamicRoutes: `/product/${Router.SingleRoutePart<T>}` | `/quiz/category/${Router.SingleRoutePart<T>}` | `/quiz/play/${Router.SingleRoutePart<T>}` | `/quiz/start/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/product/[id]` | `/quiz/category/[id]` | `/quiz/play/[id]` | `/quiz/start/[id]`;
    }
  }
}

/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/categories` | `/(tabs)/recently-viewed` | `/(tabs)/saved` | `/(tabs)/settings` | `/_sitemap` | `/categories` | `/onboarding` | `/pdf-viewer` | `/recently-viewed` | `/saved` | `/settings`;
      DynamicRoutes: `/product/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/product/[id]`;
    }
  }
}

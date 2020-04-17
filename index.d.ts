/* !
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/


interface JustCacheOptions {
  ttl?: number;
  limit?: number;
}

declare class JustCache {
  constructor (options?: JustCacheOptions);

  put(key: string, value: any): void;
  put(key: string, value: any, ttl: number): void;
  set(key: string, value: any): void;
  set(key: string, value: any, ttl: number): void;
  clean(): void;
  has(key: string): boolean;
  get<T = any>(key: string): T | null;
  delete(key: string): void;
  keys(): string[];
  count(): number;
  size(): number;
  sizeText(): string;
}

declare namespace JustCache {
  /** */
}

export = JustCache;
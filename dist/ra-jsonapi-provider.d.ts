import { fetchUtils, DataProvider } from 'react-admin';
/**
 * https://github.com/marmelab/react-admin/blob/master/packages/ra-data-simple-rest/src/index.ts
 * Latest commit 44a1d8f on 6 Dec 2020
 * 44a1d8f569db23a7fc826c1a9094e4e041cc51da
 * https://github.com/marmelab/react-admin/tree/44a1d8f569db23a7fc826c1a9094e4e041cc51da
 *
 * Maps react-admin queries to a simple REST API
 *
 * This REST dialect is similar to the one of FakeRest
 *
 * @see https://github.com/marmelab/FakeRest
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import simpleRestProvider from 'ra-data-simple-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={simpleRestProvider('http://path.to.my.api/')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 * export default (apiUrl, userSettings = {}) => (type, resource, params) => {
  let url = '';
  const settings = merge(defaultSettings, userSettings);

  const options = {
    headers: settings.headers,
  };
 */
export declare const jsonapiClient: (apiUrl: string, userSettings?: {}, httpClient?: (url: any, options?: fetchUtils.Options | undefined) => Promise<{
    status: number;
    headers: Headers;
    body: string;
    json: any;
}>, countHeader?: string) => DataProvider;
export interface includeRelations {
    resource: string;
    includes: string[];
}

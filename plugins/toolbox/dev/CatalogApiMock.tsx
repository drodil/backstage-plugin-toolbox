import {
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  CatalogRequestOptions,
  GetEntitiesByRefsRequest,
  GetEntitiesByRefsResponse,
  GetEntitiesRequest,
  GetEntitiesResponse,
  GetEntityAncestorsRequest,
  GetEntityAncestorsResponse,
  GetEntityFacetsRequest,
  GetEntityFacetsResponse,
  GetLocationsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  QueryLocationsInitialRequest,
  QueryLocationsRequest,
  QueryLocationsResponse,
  StreamEntitiesRequest,
  ValidateEntityResponse,
} from '@backstage/catalog-client';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';

export class CatalogApiMock implements CatalogApi {
  queryLocations(
    _request?: QueryLocationsRequest,
    _options?: CatalogRequestOptions,
  ): Promise<QueryLocationsResponse> {
    throw new Error('Method not implemented.');
  }

  streamLocations(
    _request?: QueryLocationsInitialRequest,
    _options?: CatalogRequestOptions,
  ): AsyncIterable<Location[]> {
    throw new Error('Method not implemented.');
  }

  addLocation(
    _location: AddLocationRequest,
    _options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    return Promise.reject();
  }

  getEntities(
    _request?: GetEntitiesRequest,
    _options?: CatalogRequestOptions,
  ): Promise<GetEntitiesResponse> {
    return Promise.resolve({
      items: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            annotations: {
              'backstage.io/managed-by-location': 'file:/tmp/catalog-info.yaml',
              'example.com/service-discovery': 'artistweb',
              'circleci.com/project-slug': 'github/example-org/artist-website',
            },
            description: 'The place to be, for great artists',
            etag: 'ZjU2MWRkZWUtMmMxZS00YTZiLWFmMWMtOTE1NGNiZDdlYzNk',
            labels: {
              'example.com/custom': 'custom_label_value',
            },
            links: [
              {
                url: 'https://admin.example-org.com',
                title: 'Admin Dashboard',
                icon: 'dashboard',
                type: 'admin-dashboard',
              },
            ],
            tags: ['java'],
            name: 'artist-web',
            uid: '2152f463-549d-4d8d-a94d-ce2b7676c6e2',
          },
          spec: {
            lifecycle: 'production',
            owner: 'artist-relations-team',
            type: 'website',
            system: 'public-websites',
          },
        },
      ],
    });
  }

  getEntitiesByRefs(
    _request: GetEntitiesByRefsRequest,
    _options?: CatalogRequestOptions,
  ): Promise<GetEntitiesByRefsResponse> {
    return Promise.reject();
  }

  getEntityAncestors(
    _request: GetEntityAncestorsRequest,
    _options?: CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    return Promise.reject();
  }

  getEntityByRef(
    _entityRef: string | CompoundEntityRef,
    _options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    return Promise.reject();
  }

  getEntityFacets(
    _request: GetEntityFacetsRequest,
    _options?: CatalogRequestOptions,
  ): Promise<GetEntityFacetsResponse> {
    return Promise.reject();
  }

  getLocationById(
    _id: string,
    _options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return Promise.reject();
  }

  getLocationByRef(
    _locationRef: string,
    _options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return Promise.reject();
  }

  refreshEntity(
    _entityRef: string,
    _options?: CatalogRequestOptions,
  ): Promise<void> {
    return Promise.reject();
  }

  removeEntityByUid(
    _uid: string,
    _options?: CatalogRequestOptions,
  ): Promise<void> {
    return Promise.reject();
  }

  removeLocationById(
    _id: string,
    _options?: CatalogRequestOptions,
  ): Promise<void> {
    return Promise.reject();
  }

  validateEntity(
    _entity: Entity,
    _locationRef: string,
    _options?: CatalogRequestOptions,
  ): Promise<ValidateEntityResponse> {
    return Promise.resolve({ valid: true });
  }

  queryEntities(
    _request?: QueryEntitiesRequest,
    _options?: CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    return Promise.reject();
  }

  getLocationByEntity(
    _entity: string | CompoundEntityRef,
    _options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return Promise.resolve(undefined);
  }

  getLocations(
    _request?: {} | undefined,
    _options?: CatalogRequestOptions | undefined,
  ): Promise<GetLocationsResponse> {
    throw new Error('Method not implemented.');
  }

  analyzeLocation(
    _: AnalyzeLocationRequest,
    __?: CatalogRequestOptions,
  ): Promise<AnalyzeLocationResponse> {
    throw new Error('Method not implemented.');
  }

  streamEntities(
    _?: StreamEntitiesRequest,
    __?: CatalogRequestOptions,
  ): AsyncIterable<Entity[]> {
    throw new Error('Method not implemented.');
  }
}

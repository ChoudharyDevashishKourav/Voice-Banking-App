// src/lib/api-client.ts
import type {
  ValueSetExpansion,
  CodeSystemLookup,
  ConceptMapTranslate,
  FhirCondition,
  SystemInfo,
  SearchRequest,
  LookupRequest,
  TranslateRequest,
  ConditionListRequest,
  PaginatedResponse,
  ApiError
} from '../types/fhir';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// const DEMO_TOKEN = import.meta.env.VITE_DEMO_TOKEN || 'demo-token-123';
const DEMO_TOKEN = localStorage.getItem('JWTS_TOKEN')

export class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = DEMO_TOKEN;
  }

  private async fetch<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-Version': 'v1',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        status: response.status,
        error: response.statusText,
        message: 'An unexpected error occurred',
        timestamp: Date.now()
      }));
      throw error;
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ValueSet expansion (search/autocomplete)
  async expandValueSet(params: SearchRequest): Promise<ValueSetExpansion> {
    const searchParams = new URLSearchParams();
    if (params.filter) searchParams.set('filter', params.filter);
    if (params.count) searchParams.set('count', params.count.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());
    if (params.url) searchParams.set('url', params.url);

    return this.fetch<ValueSetExpansion>(
      `/fhir/ValueSet/$expand?${searchParams.toString()}`
    );
  }

  // CodeSystem lookup
  async lookupCode(params: LookupRequest): Promise<CodeSystemLookup> {
    const searchParams = new URLSearchParams({
      system: params.system,
      code: params.code,
      ...(params.version && { version: params.version })
    });

    return this.fetch<CodeSystemLookup>(
      `/fhir/CodeSystem/$lookup?${searchParams.toString()}`
    );
  }

  // ConceptMap translation
  async translateConcept(request: TranslateRequest): Promise<ConceptMapTranslate> {
    return this.fetch<ConceptMapTranslate>('/fhir/ConceptMap/$translate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // Condition management
  async createCondition(condition: FhirCondition): Promise<FhirCondition> {
    return this.fetch<FhirCondition>('/fhir/Condition', {
      method: 'POST',
      body: JSON.stringify(condition)
    });
  }

  async listConditions(params: ConditionListRequest): Promise<PaginatedResponse<FhirCondition>> {
    const searchParams = new URLSearchParams();
    if (params.patient) searchParams.set('patient', params.patient);
    if (params._count) searchParams.set('_count', params._count.toString());
    if (params._offset) searchParams.set('_offset', params._offset.toString());

    return this.fetch<PaginatedResponse<FhirCondition>>(`/fhir/Condition?${searchParams.toString()}`);
  }

  // System information
  async getSystemInfo(): Promise<SystemInfo> {
    return this.fetch<SystemInfo>('/health/about');
  }

  // Metrics (returns raw prometheus text)
  async getMetrics(): Promise<string> {
    const response = await fetch(`${this.baseURL}/actuator/prometheus`);
    return response.text();
  }
}

export const apiClient = new ApiClient();

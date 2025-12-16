import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  Language,
  LexemeSearchRequest,
  LexemeSearchResult,
  LexemeDetailRequest,
  LexemeDetailResult,
  ApiError,
  AddLabeledTranslationRequest,
  AddAudioTranslationRequest,
  LoginResponse,
  OauthCallbackResponse,
  LexemeMissingAudioResquest,
  LexemeMissingAudioResponse,
} from '../types/api';
import { checkIf401Error } from './utils';

/**
 * @fileoverview A centralized API client for handling all communication with the Pula mobile backend.
 * Uses Axios for HTTP requests and implements global error handling and authentication.
 */

/**
 * @class ApiClient
 * @description Manages all API interactions, including request configuration,
 * authentication token management, and standardized error handling.
 */
class ApiClient {
  private client: AxiosInstance;

  /**
   * @constructor
   * Initializes the Axios instance with a base URL, timeout, and a response interceptor
   * for global error standardization.
   */
  constructor() {
    // Determine the API base URL from the environment variable or use a fallback.
    const baseURL =
      process.env.EXPO_PUBLIC_API_BASE_URL || 'https://agpb-server-v1.toolforge.org/api';

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    /**
     * @description Adds a response interceptor to handle and standardize API errors.
     * Maps AxiosError to a simpler ApiError object with a clear message and status code.
     */
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        let errorMessage = 'An error occurred';
        let status = error.response?.status;
        // Handle different types of errors
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage =
            'Network error: Unable to connect to the server. Please check your connection.';
          status = 0;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout: The server took too long to respond.';
          status = 408;
        } else if (error.response?.status === 0) {
          errorMessage =
            'CORS error: The server is blocking requests. Please check server configuration.';
          status = 0;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
          status = error.response.status;
        } else if (error.response?.status) {
          // Handle HTTP status codes
          switch (error.response.status) {
            case 400:
              errorMessage = 'Bad request: Invalid data sent to server.';
              break;
            case 401:
              errorMessage = 'Unauthorized: Please check your credentials.';
              break;
            case 403:
              errorMessage = 'Forbidden: Access denied.';
              break;
            case 404:
              errorMessage = 'Not found: The requested resource was not found.';
              break;
            case 500:
              errorMessage = 'Server error: Internal server error occurred.';
              break;
            case 502:
              errorMessage = 'Bad gateway: Server is temporarily unavailable.';
              break;
            case 503:
              errorMessage = 'Service unavailable: Server is temporarily down.';
              break;
            default:
              errorMessage = `HTTP ${error.response.status}: ${error.response.statusText || 'Unknown error'}`;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        const apiError: ApiError = {
          message: errorMessage,
          status: status,
        };
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * @description Sets or clears the authentication token in the common headers for all subsequent requests.
   * @param {string | null} token The JWT or session token to use for authorization. Pass null to remove the token.
   * @sideeffect Modifies the internal Axios client headers.
   */
  setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common['x-access-tokens'] = token;
    } else {
      delete this.client.defaults.headers.common['x-access-tokens'];
    }
  }

  /**
   * @description Fetches the list of all available languages supported by the API.
   * @returns {Promise<Language[]>} A promise that resolves to an array of Language objects.
   * @throws {ApiError} Throws a standardized error if the request fails.
   */
  async getLanguages(): Promise<Language[]> {
    try {
      const response: AxiosResponse<Language[]> = await this.client.get('/languages');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * @description Searches for lexemes based on a query in a specified language.
   * @param {LexemeSearchRequest} request The search criteria, including the base language ID and search text.
   * @returns {Promise<LexemeSearchResult[]>} A promise that resolves to an array of matching lexemes.
   * @throws {ApiError} Throws a standardized error if the request fails.
   */
  async searchLexemes(request: LexemeSearchRequest): Promise<LexemeSearchResult[]> {
    try {
      const response: AxiosResponse<LexemeSearchResult[]> = await this.client.post(
        '/lexemes',
        request
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * @description Retrieves detailed information for a specific lexeme, including its translations/glosses.
   * @param {LexemeDetailRequest} request The request object containing the lexeme ID and language details.
   * @returns {Promise<LexemeDetailResult>} A promise that resolves to the detailed lexeme result.
   * @throws {ApiError} Throws a standardized error if the request fails.
   */
  async getLexemeDetails(request: LexemeDetailRequest): Promise<LexemeDetailResult> {
    try {
      const response: AxiosResponse<LexemeDetailResult> = await this.client.post(
        `/lexemes/${request.id}/translations`,
        request
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * @description Submits a new labeled translation for a lexeme.
   * @param {AddLabeledTranslationRequest[]} request An array of translation request objects.
   * @returns {Promise<void>} A promise that resolves when the translation is successfully added.
   * @throws {ApiError} Throws a standardized error (and checks for 401 Unauthorized) if the request fails.
   * @sideeffect Creates a new translation record on the server. Requires authentication.
   */
  async addLabeledTranslation(request: AddLabeledTranslationRequest[]): Promise<void> {
    try {
      await this.client.post('/lexemes/translations/add', request);
    } catch (error) {
      checkIf401Error(error as ApiError);
      throw error as ApiError;
    }
  }

  /**
   * @description Submits a new audio translation for a lexeme.
   * @param {AddAudioTranslationRequest[]} request An array of audio translation request objects.
   * @returns {Promise<void>} A promise that resolves when the audio is successfully added.
   * @throws {ApiError} Throws a standardized error (and checks for 401 Unauthorized) if the request fails.
   * @sideeffect Uploads and saves audio data on the server. Requires authentication.
   */
  async addAudioTranslation(request: AddAudioTranslationRequest[]): Promise<void> {
    try {
      await this.client.post('/lexeme/audio/add', request);
    } catch (error) {
      checkIf401Error(error as ApiError);
      throw error as ApiError;
    }
  }

  /**
   * @description Initiates the OAuth login flow by requesting the redirect string from the backend.
   * @returns {Promise<LoginResponse>} A promise that resolves to an object containing the required redirect URL.
   * @throws {ApiError} Throws a standardized error if the request fails.
   */
  async login(): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.client.get('/auth/login');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * @description Final step of the OAuth flow: exchanges the verifier and token for a final application token.
   * @param {string} oauth_verifier The verifier string obtained from the OAuth provider callback.
   * @param {string} oauth_token The temporary token obtained from the OAuth provider callback.
   * @returns {Promise<OauthCallbackResponse>} A promise that resolves to the final session/access token.
   * @throws {ApiError} Throws a standardized error if the exchange fails.
   */
  async oauthCallback(oauth_verifier: string, oauth_token: string): Promise<OauthCallbackResponse> {
    try {
      const response: AxiosResponse<OauthCallbackResponse> = await this.client.get(
        `/oauth-callback?oauth_verifier=${encodeURIComponent(oauth_verifier)}&oauth_token=${encodeURIComponent(oauth_token)}`
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * @description Invalidate the current session on the backend.
   * @returns {Promise<void>} A promise that resolves when the logout is successful.
   * @throws {ApiError} Throws a standardized error (and checks for 401 Unauthorized) if the request fails.
   * @sideeffect Terminates the user's session on the server.
   */
  async logout(): Promise<void> {
    try {
      await this.client.get('/auth/logout');
    } catch (error) {
      checkIf401Error(error as ApiError);
      throw error as ApiError;
    }
  }

  /**
   * @description Retrieves a list of lexemes that are currently missing audio recordings for a specific language.
   * @param {LexemeMissingAudioResquest} request The request containing the target language ID.
   * @returns {Promise<LexemeMissingAudioResponse>} A promise that resolves to an object containing the list of lexemes.
   * @throws {ApiError} Throws a standardized error if the request fails.
   */
  async getLexemeMissingAudio(
    request: LexemeMissingAudioResquest
  ): Promise<LexemeMissingAudioResponse> {
    try {
      const response: AxiosResponse<LexemeMissingAudioResponse> = await this.client.post(
        '/lexemes/missing/audio',
        request
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}

/**
 * @description Export a singleton instance of the ApiClient for use across the application.
 */
export const apiClient = new ApiClient();

/**
 * @description Export individual API methods for convenience and cleaner component imports.
 * This simplifies calling API functions without needing to access `apiClient.methodName()`.
 */
export const api = {
  /** @see ApiClient.getLanguages */
  getLanguages: () => apiClient.getLanguages(),
  /** @see ApiClient.searchLexemes */
  searchLexemes: (request: LexemeSearchRequest) => apiClient.searchLexemes(request),
  /** @see ApiClient.getLexemeDetails */
  getLexemeDetails: (request: LexemeDetailRequest) => apiClient.getLexemeDetails(request),
  /** @see ApiClient.addLabeledTranslation */
  addLabeledTranslation: (request: AddLabeledTranslationRequest[]) =>
    apiClient.addLabeledTranslation(request),
  /** @see ApiClient.addAudioTranslation */
  addAudioTranslation: (request: AddAudioTranslationRequest[]) =>
    apiClient.addAudioTranslation(request),
  /** @see ApiClient.login */
  login: () => apiClient.login(),
  /** @see ApiClient.oauthCallback */
  oauthCallback: (oauth_verifier: string, oauth_token: string) =>
    apiClient.oauthCallback(oauth_verifier, oauth_token),
  /** @see ApiClient.logout */
  logout: () => apiClient.logout(),
  /** @see ApiClient.setAuthToken */
  setAuthToken: (token: string | null) => apiClient.setAuthToken(token),
  /** @see ApiClient.getLexemeMissingAudio */
  getLexemeMissingAudio: (request: LexemeMissingAudioResquest) =>
    apiClient.getLexemeMissingAudio(request),
};

export default apiClient;

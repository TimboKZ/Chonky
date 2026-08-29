export interface FsgRequestParams {
  path: string
  method?: string
  body?: BodyInit | null
  headers?: Record<string, string>
  /** Skip the JSON Content-Type — required for `FormData`, which sets its own boundary. */
  omitContentType?: boolean
  responseHandler?: (response: Response) => Promise<any>
  signal?: AbortSignal
}

export type FsgRequestFn = (params: FsgRequestParams) => Promise<any>

/**
 * Builds the fetch wrapper the FSG adapter talks through. Credentials are included
 * because the apps authenticate with a session cookie against the API gateway.
 */
export function createFsgRequest(baseUrl: string): FsgRequestFn {
  return async (params: FsgRequestParams) => {
    const headers: Record<string, string> = { ...params.headers }
    if (!params.omitContentType) headers['Content-Type'] = 'application/json'

    const response = await fetch(`${baseUrl}${params.path}`, {
      credentials: 'include',
      cache: 'no-store',
      method: params.method ?? 'GET',
      body: params.body ?? null,
      headers,
      signal: params.signal,
    })

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status} ${response.statusText}`)
    }
    return params.responseHandler ? params.responseHandler(response) : response.json()
  }
}

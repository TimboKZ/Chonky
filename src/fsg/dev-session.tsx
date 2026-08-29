import { useCallback, useEffect, useState } from 'react'
import { LogIn, RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from '../ui/primitives/button'
import { Spinner } from '../ui/primitives/progress'

export type SessionState = 'checking' | 'signed-in' | 'signed-out' | 'unreachable'

export interface DevSessionOptions {
  identityServiceUrl: string
}

/**
 * Whether this browser holds a live FSG session.
 *
 * The file-storage service authenticates with the `fsg_apps_session` cookie, which
 * is set by the identity service on a `*.fsgapps.com` origin. Storybook runs on
 * localhost, so the cookie rides along cross-site — the gateway allows
 * `http://localhost:*` as a credentialed CORS origin — but only once the developer
 * has signed in somewhere. Probing `/me` first turns "not signed in" into a button
 * instead of a wall of 401s from the listing.
 */
export function useDevSession({ identityServiceUrl }: DevSessionOptions) {
  const [state, setState] = useState<SessionState>('checking')
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)

  const check = useCallback(async () => {
    setState('checking')
    try {
      const response = await fetch(`${identityServiceUrl}/me`, { credentials: 'include' })
      if (response.status === 401 || response.status === 403) {
        setState('signed-out')
        return
      }
      if (!response.ok) {
        setState('unreachable')
        return
      }
      setUser(await response.json().catch(() => null))
      setState('signed-in')
    } catch {
      // A network-level failure here is usually the VPN being off, not a bad
      // session — worth telling apart, since signing in again won't fix it.
      setState('unreachable')
    }
  }, [identityServiceUrl])

  useEffect(() => {
    void check()
  }, [check])

  const signIn = useCallback(() => {
    // The identity service will not redirect back to localhost, so this opens in a
    // new tab: sign in there, come back, and hit Retry. The cookie is shared.
    window.open(identityServiceUrl, '_blank', 'noopener,noreferrer')
  }, [identityServiceUrl])

  return { state, user, recheck: check, signIn }
}

export interface DevSessionGateProps {
  state: SessionState
  identityServiceUrl: string
  onRetry: () => void
  onSignIn: () => void
  children: React.ReactNode
}

/** Renders the browser once there is a session, and an explanation until there is. */
export function DevSessionGate({ state, identityServiceUrl, onRetry, onSignIn, children }: DevSessionGateProps) {
  if (state === 'signed-in') return <>{children}</>

  return (
    <div className="fsg-fb-surface flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background p-8 text-center">
      {state === 'checking' ? (
        <>
          <Spinner className="size-6" />
          <p className="text-sm text-muted-foreground">Checking your dev session…</p>
        </>
      ) : state === 'signed-out' ? (
        <>
          <LogIn className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">Sign in to dev to load real files</p>
          <p className="max-w-md text-xs text-muted-foreground">
            These stories read the live file-storage service using your <code>fsg_apps_session</code> cookie. Sign in at{' '}
            <span className="font-mono">{identityServiceUrl}</span> in this browser, then come back and retry.
          </p>
          <div className="mt-1 flex gap-2">
            <Button size="sm" onClick={onSignIn}>
              <LogIn className="size-4" />
              Sign in
            </Button>
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        </>
      ) : (
        <>
          <TriangleAlert className="size-8 text-destructive" />
          <p className="text-sm font-medium">Couldn’t reach the identity service</p>
          <p className="max-w-md text-xs text-muted-foreground">
            <span className="font-mono">{identityServiceUrl}</span> didn’t respond. That usually means the VPN is off rather than a
            problem with your session.
          </p>
          <Button size="sm" variant="outline" onClick={onRetry} className="mt-1">
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </>
      )}
    </div>
  )
}

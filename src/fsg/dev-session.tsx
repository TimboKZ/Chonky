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
  const loginUrl = `${identityServiceUrl}/login?return_url=${encodeURIComponent(storybookUrl())}`

  // `silent` keeps a background re-check from blanking the panel back to a spinner:
  // the developer is looking at the sign-in button when the tab regains focus, and
  // it should stay put unless the answer actually changed.
  const check = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setState('checking')
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



  useEffect(() => {
    if (state !== 'signed-out' && state !== 'unreachable') return
    // Signing in happens in another tab, so nothing in this one changes when it
    // succeeds. Re-checking on focus turns the Retry button into a fallback
    // rather than a step: switch back and the listing is already loading.
    const recheck = () => {
      if (!document.hidden) void check({ silent: true })
    }
    window.addEventListener('focus', recheck)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [state, check])

  const signIn = useCallback(() => {
    // A new tab, not this one: whether the callback honours a localhost
    // `return_url` is up to the identity service, and either way the session
    // cookie lands on `.fsgapps.com` before the redirect. Storybook stays put and
    // picks the session up when it regains focus.
    window.open(loginUrl, '_blank', 'noopener,noreferrer')
  }, [loginUrl])

  return { state, user, recheck: () => void check(), signIn, loginUrl }
}

/**
 * Where the identity service should send the browser back to.
 *
 * Stories render in Storybook's iframe; returning to the iframe URL alone would
 * drop the developer into a chrome-less story, so this prefers the top window.
 */
function storybookUrl() {
  try {
    return window.top?.location.href ?? window.location.href
  } catch {
    // Cross-origin top window: not the Storybook case, but not worth throwing over.
    return window.location.href
  }
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
            These stories read the live file-storage service using your <code>fsg_apps_session</code> cookie. Signing in opens{' '}
            <span className="font-mono">{new URL(identityServiceUrl).host}</span> in a new tab; come back to this one when it
            finishes and the listing loads itself.
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

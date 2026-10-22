import { useEffect, useState } from 'react'
import { fetchContent } from '../services/contentService'
import { buildJourney, buildSkills, prepareMusic, prepareProjects } from '../lib/content'

const EMPTY = {
  music: [],
  projects: [],
  journey: [],
  skills: { party: [], box: [], boxCount: 0 },
}

// Loads all portfolio content once. `status` is 'loading', 'ready' or 'error';
// on error the sections render empty instead of crashing.
export function useContent() {
  const [state, setState] = useState({ ...EMPTY, status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchContent()
      .then((data) => {
        if (cancelled) return
        setState({
          music: prepareMusic(data.music),
          projects: prepareProjects(data.projects),
          journey: buildJourney(data.timeline),
          skills: buildSkills(data.skills),
          status: 'ready',
        })
      })
      .catch((err) => {
        console.error('Could not load portfolio content', err)
        if (!cancelled) setState({ ...EMPTY, status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

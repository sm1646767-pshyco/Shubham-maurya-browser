// ═══════════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER v5.0 — CUSTOM SEARCH ENGINE
//   Author: Shubham Maurya
//   Privacy-first, multi-engine, instant-answers search
// ═══════════════════════════════════════════════════════════════════

(function(window) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  //   SEARCH ENGINE CLASS
  // ═══════════════════════════════════════════════════════════════════

  class UniversalSearch {

    constructor() {
      this.engines = {
        universal: {
          name: 'Universal',
          icon: '🌐',
          url: null, // Local search
          priority: 0
        },
        google: {
          name: 'Google',
          icon: '🔍',
          url: 'https://www.google.com/search?q=',
          priority: 1
        },
        duckduckgo: {
          name: 'DuckDuckGo',
          icon: '🦆',
          url: 'https://duckduckgo.com/?q=',
          priority: 2,
          privacy: 'high'
        },
        brave: {
          name: 'Brave',
          icon: '🦁',
          url: 'https://search.brave.com/search?q=',
          priority: 3,
          privacy: 'high'
        },
        bing: {
          name: 'Bing',
          icon: '🅱️',
          url: 'https://www.bing.com/search?q=',
          priority: 4
        },
        startpage: {
          name: 'Startpage',
          icon: '🛡️',
          url: 'https://www.startpage.com/sp/search?query=',
          priority: 5,
          privacy: 'high'
        },
        ecosia: {
          name: 'Ecosia',
          icon: '🌱',
          url: 'https://www.ecosia.org/search?q=',
          priority: 6,
          privacy: 'high'
        },
        chatgpt: {
          name: 'ChatGPT',
          icon: '🤖',
          url: 'https://chatgpt.com/?q=',
          priority: 7,
          type: 'ai'
        },
        perplexity: {
          name: 'Perplexity',
          icon: '🧠',
          url: 'https://www.perplexity.ai/search?q=',
          priority: 8,
          type: 'ai'
        },
        youtube: {
          name: 'YouTube',
          icon: '▶️',
          url: 'https://www.youtube.com/results?search_query=',
          priority: 9,
          type: 'video'
        },
        wikipedia: {
          name: 'Wikipedia',
          icon: '📖',
          url: 'https://en.wikipedia.org/w/index.php?search=',
          priority: 10,
          type: 'encyclopedia'
        },
        github: {
          name: 'GitHub',
          icon: '🐙',
          url: 'https://github.com/search?q=',
          priority: 11,
          type: 'code'
        }
      };

      this.history = this.loadHistory();
      this.favorites = this.loadFavorites();
      this.stats = this.loadStats();

      console.log('[UniversalSearch] ✅ Initialized');
    }

    // ═══════════════════════════════════════════════════════════════════
    //   LOAD / SAVE
    // ═══════════════════════════════════════════════════════════════════

    loadHistory() {
      try {
        return JSON.parse(localStorage.getItem('ub_search_history') || '[]');
      } catch { return []; }
    }

    loadFavorites() {
      try {
        return JSON.parse(localStorage.getItem('ub_search_favorites') || '[]');
      } catch { return []; }
    }

    loadStats() {
      try {
        return JSON.parse(localStorage.getItem('ub_search_stats') || JSON.stringify({
          totalSearches: 0,
          todaySearches: 0,
          lastSearchDate: ''
        }));
      } catch {
        return { totalSearches: 0, todaySearches: 0, lastSearchDate: '' };
      }
    }

    saveHistory() {
      try {
        localStorage.setItem('ub_search_history', JSON.stringify(this.history.slice(0, 500)));
      } catch {}
    }

    saveFavorites() {
      try {
        localStorage.setItem('ub_search_favorites', JSON.stringify(this.favorites));
      } catch {}
    }

    saveStats() {
      try {
        localStorage.setItem('ub_search_stats', JSON.stringify(this.stats));
      } catch {}
    }

    // ═══════════════════════════════════════════════════════════════════
    //   BUILD SEARCH URL
    // ═══════════════════════════════════════════════════════════════════

    buildUrl(query, engineName = 'google') {
      const engine = this.engines[engineName] || this.engines.google;
      if (!engine.url) {
        // Universal search fallback
        return 'https://www.google.com/search?q=' + encodeURIComponent(query);
      }
      return engine.url + encodeURIComponent(query);
    }

    // ═══════════════════════════════════════════════════════════════════
    //   ADD TO HISTORY
    // ═══════════════════════════════════════════════════════════════════

    addToHistory(query, engine = 'google') {
      if (!query || query.trim().length === 0) return;
      query = query.trim();

      // Avoid duplicates
      this.history = this.history.filter(h => h.query !== query);
      this.history.unshift({
        query,
        engine,
        time: Date.now()
      });

      // Update stats
      const today = new Date().toDateString();
      if (this.stats.lastSearchDate !== today) {
        this.stats.todaySearches = 0;
        this.stats.lastSearchDate = today;
      }
      this.stats.totalSearches++;
      this.stats.todaySearches++;

      this.saveHistory();
      this.saveStats();
    }

    // ═══════════════════════════════════════════════════════════════════
    //   AUTO SUGGESTIONS
    // ═══════════════════════════════════════════════════════════════════

    getSuggestions(query) {
      if (!query || query.length < 1) return [];

      const q = query.toLowerCase();
      const suggestions = [];
      const seen = new Set();

      // History matches
      this.history.forEach(h => {
        if (suggestions.length >= 5) return;
        if (h.query.toLowerCase().includes(q) && !seen.has(h.query)) {
          suggestions.push({
            type: 'history',
            icon: '🕐',
            text: h.query,
            source: 'History'
          });
          seen.add(h.query);
        }
      });

      // Predefined popular searches
      const popular = [
        'youtube', 'google', 'chatgpt', 'gmail', 'github',
        'wikipedia', 'reddit', 'twitter', 'instagram', 'facebook',
        'stackoverflow', 'linkedin', 'amazon', 'netflix', 'spotify'
      ];
      popular.forEach(p => {
        if (suggestions.length >= 8) return;
        if (p.includes(q) && !seen.has(p)) {
          suggestions.push({
            type: 'popular',
            icon: '🔥',
            text: p,
            source: 'Popular'
          });
          seen.add(p);
        }
      });

      // Google suggestions (fallback)
      if (suggestions.length < 5) {
        suggestions.push({
          type: 'search',
          icon: '🔍',
          text: query,
          source: 'Search'
        });
      }

      return suggestions.slice(0, 8);
    }

    // ═══════════════════════════════════════════════════════════════════
    //   INSTANT ANSWERS
    // ═══════════════════════════════════════════════════════════════════

    getInstantAnswer(query) {
      const q = query.trim().toLowerCase();

      // ═══ Math calculation ═══
      if (/^[\d\s+\-*/().%]+$/.test(q) && /[+\-*/]/.test(q)) {
        try {
          const result = Function('"use strict"; return (' + q + ')')();
          if (typeof result === 'number' && isFinite(result)) {
            return {
              type: 'calculation',
              icon: '🧮',
              title: '= ' + result,
              subtitle: 'Calculation'
            };
          }
        } catch {}
      }

      // ═══ Time ═══
      if (q === 'time' || q === 'what time is it') {
        return {
          type: 'time',
          icon: '🕐',
          title: new Date().toLocaleTimeString(),
          subtitle: 'Current time'
        };
      }

      // ═══ Date ═══
      if (q === 'date' || q === 'what date is it' || q === 'today') {
        return {
          type: 'date',
          icon: '📅',
          title: new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }),
          subtitle: 'Today'
        };
      }

      // ═══ Unit conversion ═══
      const unitMatch = q.match(/^(\d+\.?\d*)\s*(km|m|cm|mm|mi|ft|in|kg|g|lb|oz|c|f|k)\s+(to|in)\s+(km|m|cm|mm|mi|ft|in|kg|g|lb|oz|c|f|k)$/);
      if (unitMatch) {
        const value = parseFloat(unitMatch[1]);
        const from = unitMatch[2];
        const to = unitMatch[4];
        const converted = this.convertUnit(value, from, to);
        if (converted !== null) {
          return {
            type: 'conversion',
            icon: '📏',
            title: `${value} ${from} = ${converted.toFixed(4)} ${to}`,
            subtitle: 'Unit conversion'
          };
        }
      }

      // ═══ Percentage ═══
      const percentMatch = q.match(/^(\d+\.?\d*)%\s+of\s+(\d+\.?\d*)$/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        const num = parseFloat(percentMatch[2]);
        const result = (percent / 100) * num;
        return {
          type: 'percentage',
          icon: '💯',
          title: `${percent}% of ${num} = ${result}`,
          subtitle: 'Percentage'
        };
      }

      return null;
    }

    convertUnit(value, from, to) {
      const toMeters = { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048, in: 0.0254 };
      const toKg = { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 };

      if (toMeters[from] && toMeters[to]) {
        return value * toMeters[from] / toMeters[to];
      }
      if (toKg[from] && toKg[to]) {
        return value * toKg[from] / toKg[to];
      }
      // Temperature
      if (from === 'c' && to === 'f') return value * 9/5 + 32;
      if (from === 'c' && to === 'k') return value + 273.15;
      if (from === 'f' && to === 'c') return (value - 32) * 5/9;
      if (from === 'f' && to === 'k') return (value - 32) * 5/9 + 273.15;
      if (from === 'k' && to === 'c') return value - 273.15;
      if (from === 'k' && to === 'f') return (value - 273.15) * 9/5 + 32;

      return null;
    }

    // ═══════════════════════════════════════════════════════════════════
    //   PARSE QUERY
    // ═══════════════════════════════════════════════════════════════════

    parseQuery(query) {
      query = query.trim();
      if (!query) return null;

      const lower = query.toLowerCase();

      // ═══ Bang operators ═══
      let engine = 'google';
      let cleanQuery = query;

      if (lower.startsWith('!g ')) { engine = 'google'; cleanQuery = query.slice(3); }
      else if (lower.startsWith('!d ') || lower.startsWith('!ddg ')) { engine = 'duckduckgo'; cleanQuery = query.replace(/^!\w+\s/, ''); }
      else if (lower.startsWith('!b ')) { engine = 'brave'; cleanQuery = query.slice(3); }
      else if (lower.startsWith('!bing ')) { engine = 'bing'; cleanQuery = query.slice(6); }
      else if (lower.startsWith('!w ') || lower.startsWith('!wiki ')) { engine = 'wikipedia'; cleanQuery = query.replace(/^!\w+\s/, ''); }
      else if (lower.startsWith('!yt ') || lower.startsWith('!youtube ')) { engine = 'youtube'; cleanQuery = query.replace(/^!\w+\s/, ''); }
      else if (lower.startsWith('!gh ')) { engine = 'github'; cleanQuery = query.slice(4); }
      else if (lower.startsWith('!ai ')) { engine = 'chatgpt'; cleanQuery = query.slice(4); }
      else if (lower.startsWith('!p ')) { engine = 'perplexity'; cleanQuery = query.slice(3); }
      else if (lower.startsWith('!sp ')) { engine = 'startpage'; cleanQuery = query.slice(4); }
      else if (lower.startsWith('!e ')) { engine = 'ecosia'; cleanQuery = query.slice(3); }

      return {
        engine,
        query: cleanQuery,
        instantAnswer: this.getInstantAnswer(cleanQuery)
      };
    }

    // ═══════════════════════════════════════════════════════════════════
    //   FAVORITES
    // ═══════════════════════════════════════════════════════════════════

    addFavorite(query) {
      if (!query || this.favorites.includes(query)) return;
      this.favorites.unshift(query);
      if (this.favorites.length > 20) this.favorites.pop();
      this.saveFavorites();
    }

    removeFavorite(query) {
      this.favorites = this.favorites.filter(f => f !== query);
      this.saveFavorites();
    }

    // ═══════════════════════════════════════════════════════════════════
    //   STATS
    // ═══════════════════════════════════════════════════════════════════

    getStats() {
      return {
        ...this.stats,
        historyCount: this.history.length,
        favoritesCount: this.favorites.length
      };
    }

    clearHistory() {
      this.history = [];
      this.saveHistory();
    }

    // ═══════════════════════════════════════════════════════════════════
    //   GET ENGINE INFO
    // ═══════════════════════════════════════════════════════════════════

    getEngines() {
      return Object.keys(this.engines).map(key => ({
        id: key,
        ...this.engines[key]
      }));
    }

    getEngine(name) {
      return this.engines[name] || null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  //   EXPOSE TO WINDOW
  // ═══════════════════════════════════════════════════════════════════

  window.UniversalSearch = new UniversalSearch();

  console.log('🔍 Universal Search Engine v5.0 — Ready');

})(window);
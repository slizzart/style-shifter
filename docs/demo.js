// Import the actual StyleShifter library
import { Theme, ThemeRegistry, CSSProcessor } from './lib/index.js';

// Create CSS Processor
const processor = new CSSProcessor({ namespace: 'demo' });

// Real theme implementation using StyleShifter
class DemoTheme extends Theme {
  constructor(options) {
    super(options);
  }
}

// Color themes - only define colors
const colorThemes = {
  default: new DemoTheme({
    namespace: 'demo',
    name: 'default',
    data: {
      navBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      logoSize: 24,
      heroBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      heroTitleSize: 48,
      heroTextSize: 20,
      switcherBackground: '#ffffff',
      cardBackground: '#ffffff',
      headingColor: '#2d3748',
      subheadingColor: '#4a5568',
      textColor: '#718096',
      cardHeadingColor: '#2d3748',
      cardTextColor: '#718096',
      buttonBackground: '#667eea',
      buttonText: '#ffffff',
      primaryButton: '#667eea',
      primaryButtonText: '#ffffff',
      secondaryButton: '#48bb78',
      secondaryButtonText: '#ffffff',
      accentColor: '#ed8936',
      dangerColor: '#f56565',
      codeBackground: '#1a202c',
      codeText: '#e2e8f0',
      demoCardBackground: '#f7fafc',
      footerBackground: '#2d3748',
      footerText: '#a0aec0'
    }
  }),

  dark: new DemoTheme({
    namespace: 'demo',
    name: 'dark',
    data: {
      navBackground: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      heroBackground: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      switcherBackground: '#2d3748',
      cardBackground: '#2d3748',
      headingColor: '#f7fafc',
      subheadingColor: '#e2e8f0',
      textColor: '#cbd5e0',
      cardHeadingColor: '#f7fafc',
      cardTextColor: '#cbd5e0',
      buttonBackground: '#4299e1',
      buttonText: '#ffffff',
      primaryButton: '#4299e1',
      primaryButtonText: '#ffffff',
      secondaryButton: '#48bb78',
      secondaryButtonText: '#ffffff',
      accentColor: '#ed8936',
      dangerColor: '#fc8181',
      codeBackground: '#1a202c',
      codeText: '#e2e8f0',
      demoCardBackground: '#1a202c',
      footerBackground: '#1a202c',
      footerText: '#a0aec0'
    }
  }),

  ocean: new DemoTheme({
    namespace: 'demo',
    name: 'ocean',
    data: {
      navBackground: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      heroBackground: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      switcherBackground: '#ffffff',
      cardBackground: '#ffffff',
      headingColor: '#0c4a6e',
      subheadingColor: '#075985',
      textColor: '#0e7490',
      cardHeadingColor: '#0c4a6e',
      cardTextColor: '#0e7490',
      buttonBackground: '#0ea5e9',
      buttonText: '#ffffff',
      primaryButton: '#0ea5e9',
      primaryButtonText: '#ffffff',
      secondaryButton: '#06b6d4',
      secondaryButtonText: '#ffffff',
      accentColor: '#f59e0b',
      dangerColor: '#ef4444',
      codeBackground: '#083344',
      codeText: '#e0f2fe',
      demoCardBackground: '#f0f9ff',
      footerBackground: '#0c4a6e',
      footerText: '#bae6fd'
    }
  }),

  forest: new DemoTheme({
    namespace: 'demo',
    name: 'forest',
    data: {
      navBackground: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      heroBackground: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      switcherBackground: '#ffffff',
      cardBackground: '#ffffff',
      headingColor: '#064e3b',
      subheadingColor: '#065f46',
      textColor: '#047857',
      cardHeadingColor: '#064e3b',
      cardTextColor: '#047857',
      buttonBackground: '#059669',
      buttonText: '#ffffff',
      primaryButton: '#059669',
      primaryButtonText: '#ffffff',
      secondaryButton: '#10b981',
      secondaryButtonText: '#ffffff',
      accentColor: '#f59e0b',
      dangerColor: '#ef4444',
      codeBackground: '#022c22',
      codeText: '#d1fae5',
      demoCardBackground: '#f0fdf4',
      footerBackground: '#064e3b',
      footerText: '#a7f3d0'
    }
  }),

  sunset: new DemoTheme({
    namespace: 'demo',
    name: 'sunset',
    data: {
      navBackground: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      heroBackground: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      switcherBackground: '#ffffff',
      cardBackground: '#ffffff',
      headingColor: '#7c2d12',
      subheadingColor: '#9a3412',
      textColor: '#c2410c',
      cardHeadingColor: '#7c2d12',
      cardTextColor: '#c2410c',
      buttonBackground: '#f97316',
      buttonText: '#ffffff',
      primaryButton: '#f97316',
      primaryButtonText: '#ffffff',
      secondaryButton: '#fb923c',
      secondaryButtonText: '#ffffff',
      accentColor: '#ec4899',
      dangerColor: '#ef4444',
      codeBackground: '#431407',
      codeText: '#fed7aa',
      demoCardBackground: '#fff7ed',
      footerBackground: '#7c2d12',
      footerText: '#fed7aa'
    }
  }),

  neon: new DemoTheme({
    namespace: 'demo',
    name: 'neon',
    data: {
      navBackground: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      heroBackground: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      switcherBackground: '#1a1625',
      cardBackground: '#1a1625',
      headingColor: '#f5f3ff',
      subheadingColor: '#e9d5ff',
      textColor: '#d8b4fe',
      cardHeadingColor: '#f5f3ff',
      cardTextColor: '#d8b4fe',
      buttonBackground: '#8b5cf6',
      buttonText: '#ffffff',
      primaryButton: '#8b5cf6',
      primaryButtonText: '#ffffff',
      secondaryButton: '#ec4899',
      secondaryButtonText: '#ffffff',
      accentColor: '#06b6d4',
      dangerColor: '#f43f5e',
      codeBackground: '#0f0a1a',
      codeText: '#f5f3ff',
      demoCardBackground: '#2e1065',
      footerBackground: '#0f0a1a',
      footerText: '#c4b5fd'
    }
  })
};

// Typography themes - only define sizes
const typographyThemes = {
  small: new DemoTheme({
    namespace: 'demo',
    name: 'small',
    data: {
      logoSize: 20,
      heroTitleSize: 36,
      heroTextSize: 16,
      textSize: 14,
      subheadingSize: 17,
      h1Size: 28,
      h2Size: 22,
      h3Size: 18
    }
  }),

  big: new DemoTheme({
    namespace: 'demo',
    name: 'big',
    data: {
      logoSize: 28,
      heroTitleSize: 60,
      heroTextSize: 24,
      textSize: 19,
      subheadingSize: 24,
      h1Size: 44,
      h2Size: 34,
      h3Size: 28
    }
  })
};

// State tracking
let currentColorTheme = null;
let currentTypographyTheme = null;
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="30" cy="30" r="20" fill="#FF0000"/>
  <circle cx="70" cy="30" r="20" fill="#00FF00"/>
  <circle cx="30" cy="70" r="20" fill="#0000FF"/>
  <circle cx="70" cy="70" r="20" fill="#FFFF00"/>
</svg>`;

// Apply color theme and register cascade
window.applyColorTheme = function(themeName) {
  const theme = colorThemes[themeName];
  if (theme) {
    if (currentColorTheme) {
      currentColorTheme.removeFrom(document.body);
    }
    
    currentColorTheme = theme;
    theme.applyTo(document.body);
    
    // If typography theme exists, re-apply cascade
    if (currentTypographyTheme) {
      ThemeRegistry.registerCascade('demo', [theme.data, currentTypographyTheme.data]);
      currentTypographyTheme.applyTo(document.body);
    }
    
    processor.addTheme(theme);
    updateThemedSvg(theme);
    
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const clickedBtn = window.event?.target?.closest?.('.color-btn');
    if (clickedBtn) clickedBtn.classList.add('active');
    
    // Enable reset buttons
    document.getElementById('reset-color-btn').disabled = false;
    document.getElementById('reset-all-btn').disabled = false;
  }
};

// Apply typography theme and register cascade
window.applyTypographyTheme = function(themeName) {
  const theme = typographyThemes[themeName];
  if (theme) {
    if (currentTypographyTheme) {
      currentTypographyTheme.removeFrom(document.body);
    }
    
    currentTypographyTheme = theme;
    
    // Register cascade: typography theme takes precedence over color theme
    if (currentColorTheme) {
      ThemeRegistry.registerCascade('demo', [currentColorTheme.data, theme.data]);
    }
    
    theme.applyTo(document.body);
    processor.addTheme(theme);
    
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const clickedBtn = window.event?.target?.closest?.('.type-btn');
    if (clickedBtn) clickedBtn.classList.add('active');
    
    // Enable reset buttons
    document.getElementById('reset-type-btn').disabled = false;
    document.getElementById('reset-all-btn').disabled = false;
  }
};

window.resetThemes = function() {
  if (currentColorTheme) {
    currentColorTheme.removeFrom(document.body);
    currentColorTheme = null;
  }
  if (currentTypographyTheme) {
    currentTypographyTheme.removeFrom(document.body);
    currentTypographyTheme = null;
  }
  
  ThemeRegistry.clearCascades('demo');
  
  const styleEl = document.getElementById(`style-shifter-demo`);
  if (styleEl) styleEl.remove();
  
  const themedSvg = document.querySelector('.themed-svg');
  if (themedSvg) {
    themedSvg.style.backgroundImage = "url('assets/demo-icon.svg')";
  }
  
  document.querySelectorAll('.theme-btn.active').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Disable all reset buttons
  document.getElementById('reset-color-btn').disabled = true;
  document.getElementById('reset-type-btn').disabled = true;
  document.getElementById('reset-all-btn').disabled = true;
};

window.resetColorTheme = function() {
  if (currentColorTheme) {
    currentColorTheme.removeFrom(document.body);
    currentColorTheme = null;
  }
  
  // Re-apply typography theme if it exists
  if (currentTypographyTheme) {
    ThemeRegistry.clearCascades('demo');
    currentTypographyTheme.applyTo(document.body);
  }
  
  const themedSvg = document.querySelector('.themed-svg');
  if (themedSvg) {
    themedSvg.style.backgroundImage = "url('assets/demo-icon.svg')";
  }
  
  document.querySelectorAll('.color-btn.active').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Disable color reset button
  document.getElementById('reset-color-btn').disabled = true;
  
  // Disable reset all if no themes active
  if (!currentTypographyTheme) {
    document.getElementById('reset-all-btn').disabled = true;
  }
};

window.resetTypographyTheme = function() {
  if (currentTypographyTheme) {
    currentTypographyTheme.removeFrom(document.body);
    currentTypographyTheme = null;
  }
  
  // Re-apply color theme if it exists
  if (currentColorTheme) {
    ThemeRegistry.clearCascades('demo');
    currentColorTheme.applyTo(document.body);
  }
  
  document.querySelectorAll('.type-btn.active').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Disable typography reset button
  document.getElementById('reset-type-btn').disabled = true;
  
  // Disable reset all if no themes active
  if (!currentColorTheme) {
    document.getElementById('reset-all-btn').disabled = true;
  }
};

// Legacy support
window.applyTheme = function(themeName) {
  window.applyColorTheme(themeName);
};

window.removeTheme = window.resetThemes;

// SVG color mapping function (for demo visualization only)
function mapSvgColors(svg, originalColors, replacements) {
  let result = svg;
  originalColors.forEach((original, i) => {
    const regex = new RegExp(original, 'gi');
    result = result.replace(regex, replacements[i]);
  });
  const base64 = btoa(unescape(encodeURIComponent(result)));
  return `data:image/svg+xml;base64,${base64}`;
}

function updateThemedSvg(theme) {
  const themedSvg = document.querySelector('.themed-svg');
  if (!themedSvg) return;
  
  // Map original SVG colors to theme colors
  const dataUri = mapSvgColors(
    svgContent,
    ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
    [
      theme.data.primaryButton,
      theme.data.secondaryButton,
      theme.data.accentColor,
      theme.data.dangerColor
    ]
  );
  
  themedSvg.style.backgroundImage = `url("${dataUri}")`;
}

// Detect when theme switcher becomes sticky
const themeSwitcher = document.querySelector('.theme-switcher');

function checkSticky() {
  const rect = themeSwitcher.getBoundingClientRect();
  const isStuck = rect.top <= 80;
  themeSwitcher.classList.toggle('stuck', isStuck);
}

window.addEventListener('scroll', checkSticky, { passive: true });
window.addEventListener('load', checkSticky);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('🎨 StyleShifter Demo loaded! Try switching themes above.');

# B2B Design System

A scalable, accessible React + TypeScript design system with a robust token-based color system, advanced Data Table, and Multi-Step Wizard. Documented with Storybook.

## Features

- **Token-based color system** (light/dark, semantic, neutral, WCAG-compliant)
- **Advanced Data Table** (sorting, filtering, selection, expansion, responsive)
- **Multi-Step Wizard** (progress, validation, async, theming, responsive)
- **Accessible** (ARIA, keyboard nav, focus ring)
- **Storybook** documentation

## Setup

```bash
# Clone the repository
git clone https://github.com/im-ayushraj/colorsystem.git
cd colorsystem

# Install dependencies
npm install

# Start Storybook
npm run storybook
```

## Approach

- **Color System:** CSS variables for all tokens, light/dark support, semantic/neutral/surface colors, WCAG-compliant contrast. Documented in Storybook with naming conventions, examples, and accessibility notes.
- **Components:** Each in its own folder, fully typed with TypeScript, accessible, responsive, and reusable. All interaction states and logic handled with best practices.
- **Storybook:** Stories for all states, anatomy, accessibility, theming, and best practices. Includes documentation for color system and both components.
- **Theming:** Global theme switcher for light/dark mode, using CSS variables.

## Project Structure

```
src/
  components/
    DataTable/
      DataTable.tsx        # Main Data Table component
      DataTable.types.ts   # TypeScript types
      DataTable.css        # Styles
      index.ts
    MultiStepWizard/
      MultiStepWizard.tsx  # Main Wizard component
      MultiStepWizard.types.ts
      index.ts
  theme/
    colors.css            # Color tokens and themes
  stories/
    ColorSystem.mdx       # Color system docs
    DataTable.stories.tsx # Data Table stories
    MultiStepWizard.stories.tsx # Wizard stories
```

## Storybook Preview

Deploy your Storybook with [Chromatic](https://www.chromatic.com/) or [Vercel](https://vercel.com/). Example:

- Chromatic: [chromatic.com](https://www.chromatic.com/)
- Vercel: [vercel.com](https://vercel.com/)

## Screenshots / GIFs

> Add GIFs or screenshots here to showcase interactive states, theme switching, and animations.

## License

MIT

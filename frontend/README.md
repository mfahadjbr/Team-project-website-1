# Frontend with Tailwind CSS

This project uses Tailwind CSS for styling.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Build Tailwind CSS:
```bash
npm run build:css
```

3. Start development server:
```bash
npm start
```

## Tailwind CSS Usage

### Custom Colors
- `bg-primary-green` - Primary green background
- `text-primary-green` - Primary green text
- `bg-soft-yellow` - Soft yellow background
- `text-text-dark` - Dark text color

### Custom Shadows
- `shadow-custom` - Custom shadow
- `shadow-card` - Card shadow

### Example Components

```jsx
// Button with Tailwind classes
<button className="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-dark-green transition-colors">
  Click Me
</button>

// Card with custom styling
<div className="bg-white rounded-lg shadow-card p-6 border border-accent-green">
  <h3 className="text-xl font-bold text-text-dark mb-2">Card Title</h3>
  <p className="text-text-light">Card content goes here</p>
</div>
```

## File Structure
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration  
- `src/index.css` - Tailwind imports and custom CSS variables

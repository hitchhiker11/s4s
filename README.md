# Shop4Shoot - Next.js Frontend for 1C-Bitrix CMS

This project is a Next.js SSR frontend for an existing 1C-Bitrix CMS e-commerce site. It uses a reverse-engineered approach to integrate with Bitrix Ajax endpoints.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env.local` and adjust values:
   ```
   cp .env .env.local
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Architecture

The project follows a clean architecture approach with clear separation of concerns:

### API Layer

The API layer is responsible for communicating with the Bitrix backend:

- `src/lib/api/bitrix.ts` - Core API adapters and utilities for Bitrix integration
- Strongly typed with Zod schemas for runtime validation
- Error handling and logging

### Hooks Layer

Custom React hooks abstract away the complexity of data fetching:

- `src/lib/hooks/useBasketCount.ts` - Hook for basket count functionality
- Integrated with React Query for caching, stale-while-revalidate, etc.

### Component Layer

React components using the Atomic Design methodology:

- Atoms: Basic UI elements
- Molecules: Groups of atoms
- Organisms: Groups of molecules (like Header)
- Templates: Page layouts
- Pages: Specific page implementations

## Bitrix Integration

This frontend integrates with the following Bitrix endpoints:

### Basket API

- Endpoint: `/bitrix/ajax/getProductCountInBasket.php`
- Returns: `{ count: number, status: boolean }`
- Usage: Displays the number of items in the cart in the Header component

### Authentication

- Relies on cookies for authentication state
- Integration with Bitrix auth system is pending implementation

## Development Guidelines

1. **TypeScript**: Use strict typing everywhere
2. **API Integration**: Use the Bitrix adapter pattern for all API calls
3. **Caching**: Implement proper caching strategies based on data type
4. **Error Handling**: Gracefully handle API errors with fallbacks
5. **Testing**: Write tests for all new functionality

## Next Steps

- [ ] Implement user authentication integration
- [ ] Add product catalog browsing
- [ ] Implement cart functionality
- [ ] Add checkout process
- [ ] Implement search functionality

## License

This project is proprietary and confidential. 
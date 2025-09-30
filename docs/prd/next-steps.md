# Next Steps

## UX Expert Prompt

**Prompt for UX/Design Architect**:

> "Please review the Life OS PRD and create comprehensive UI/UX specifications. Focus on:
>
> 1. **Design System Implementation Guide**: Detailed specifications for the Design System including component library, color usage guidelines, typography hierarchy, spacing system, and responsive breakpoints.
>
> 2. **High-Fidelity Wireframes/Mockups**: For all core screens (Daily Tracker, Calories, Injections, Nirvana, Winners Bible, Analytics, Settings, BMR Calculator).
>
> 3. **Interaction Design Specifications**: Detailed interaction patterns for forms, modals, navigation transitions, real-time updates, and touch gestures (mobile).
>
> 4. **Data Visualization Guidelines**: Chart types, color schemes, tooltip designs, and responsive chart behaviors for the Analytics dashboard.
>
> 5. **Accessibility Implementation Guide**: Specific WCAG AA compliance strategies, keyboard navigation flows, screen reader considerations, and focus management patterns.
>
> Please use this PRD as the authoritative source for all functional requirements and user flows. Deliver the UI/UX specifications in a format ready for handoff to the Frontend Architect."

## Architect Prompt

**Prompt for Technical Architect**:

> "Please review the Life OS PRD and create a comprehensive technical architecture specification. Focus on:
>
> 1. **Database Schema Design**: Complete PostgreSQL schema with tables, columns, data types, foreign keys, indexes, and Row Level Security (RLS) policies. Ensure proper normalization and query optimization.
>
> 2. **Supabase Integration Architecture**: Client configuration (browser/server), authentication flows, real-time subscription patterns, storage bucket policies, and edge function requirements (if any).
>
> 3. **Next.js Application Architecture**: Directory structure, routing strategy (App Router), server vs client components, API routes, middleware for auth, and state management approach.
>
> 4. **Data Flow & Business Logic**: Calculation implementations (BMR, calorie balance, BMI, macro percentages, injection progress), real-time update mechanisms, and data synchronization patterns.
>
> 5. **Security & Performance**: Authentication token handling, RLS policy enforcement, query optimization strategies, caching approach, and error handling patterns.
>
> 6. **Testing Strategy**: Unit test structure, integration test approach, E2E test critical paths, and CI/CD pipeline configuration.
>
> Please use this PRD as the definitive source for all functional requirements, technical assumptions, and user stories. Deliver a technical architecture document ready for developer implementation with clear, actionable specifications."

---

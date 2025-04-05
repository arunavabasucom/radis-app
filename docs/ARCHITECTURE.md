# RADIS App Architecture

## System Overview

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI]
        Form[Form Component]
        Plot[Plot Component]
        Store[Zustand Store]
    end

    subgraph "Backend Layer"
        API[FastAPI Server]
        Calc[RADIS Calculator]
        Valid[Pydantic Validator]
    end

    subgraph "Data Layer"
        HITRAN[HITRAN Database]
        Cache[Response Cache]
    end

    UI --> Form
    UI --> Plot
    Form --> Store
    Plot --> Store
    Store --> |HTTP POST| API
    API --> Valid
    Valid --> Calc
    Calc --> HITRAN
    Calc --> Cache
    Cache --> API
    API --> |JSON Response| Store
```

### Request-Response Flow

```mermaid
sequenceDiagram
    participant User
    participant Form
    participant Store
    participant API
    participant Validator
    participant RADIS
    participant HITRAN

    User->>Form: Input Parameters
    Note over Form: Validate Input
    Form->>Store: Update State
    Store->>API: POST /calculate-spectrum
    Note over API: Request Processing
    API->>Validator: Validate Payload
    Validator-->>API: Validation Result
    
    alt Valid Request
        API->>RADIS: Calculate Spectrum
        RADIS->>HITRAN: Fetch Molecular Data
        HITRAN-->>RADIS: Return Data
        RADIS-->>API: Spectrum Results
        API-->>Store: JSON Response
        Store->>Form: Update UI State
        Form->>User: Show Success
    else Invalid Request
        API-->>Store: Error Response
        Store->>Form: Update Error State
        Form->>User: Show Error
    end
```

### Component Architecture

```mermaid
classDiagram
    class Frontend {
        +components
        +store
        +utils
        +types
    }
    
    class Components {
        +Form
        +Plot
        +Fields
        +ErrorAlert
    }
    
    class Store {
        +formState
        +plotState
        +errorState
        +actions
    }
    
    class Backend {
        +routes
        +models
        +services
        +utils
    }
    
    class RADISEngine {
        +calculate()
        +fetch_hitran()
        +process_spectrum()
    }

    Frontend --> Components
    Frontend --> Store
    Components --> Store
    Backend --> RADISEngine
    RADISEngine --> HITRAN
```

### Data Flow Architecture

```mermaid
flowchart TD
    subgraph UserInterface
        A[User Input] --> B[Form Validation]
        B --> C[State Management]
        C --> D[API Request]
    end

    subgraph BackendProcessing
        D --> E[Request Validation]
        E --> F[RADIS Calculation]
        F --> G[Response Formation]
    end

    subgraph DataVisualization
        G --> H[Store Update]
        H --> I[Plot Rendering]
        I --> J[User Feedback]
    end

    subgraph ErrorHandling
        B -- Invalid --> K[Form Error]
        E -- Invalid --> L[API Error]
        F -- Failed --> M[Calculation Error]
    end
```

## Component Details

### Frontend Components
- **Form**: Main form component handling user input and validation
- **Fields**: Sub-components for specific form inputs (molecule, wavelength, etc.)
- **Plot**: Spectrum visualization component
- **PlotSpectra**: Component for managing multiple spectra plots
- **ErrorAlert**: Error display component
- **Header**: Application header with navigation
- **InfoPopover**: Information tooltips for form fields
- **DownloadButtons**: Components for downloading spectrum data
- **Store**: Zustand store for managing application state

### Backend Components
- **FastAPI Router**: Handles HTTP requests and routing
- **Models**: Pydantic models for request/response validation
- **Helpers**: Utility functions and calculations
- **Constants**: Application constants and configurations
- **RADIS Engine**: Integration with RADIS for spectrum calculations
- **Cache Layer**: Response caching for optimization


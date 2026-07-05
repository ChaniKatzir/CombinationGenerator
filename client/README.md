<div dir="rtl" align="right">

# מחולל הקומבינציות (Combination Generator)

אפליקציית Web מסוג Client/Server שמייצרת את כל הפרמוטציות האפשריות של המספרים 1..n, עבור n שלם בין 1 ל-20, **בלי לחשב מראש ובלי לשמור בזיכרון את כל הפרמוטציות**.

הפתרון תוכנן לפי דרישות המטלה, עם דגש על ארכיטקטורה נקייה, הפרדת אחריות, ומדידה מדויקת (לא הבטחה) של כל התנהגות מתועדת - כל סעיף במסמך הזה נבדק מול הקוד בפועל.

</div>

## Technology Stack

### Backend
- .NET 8
- ASP.NET Core Web API
- Dependency Injection
- Swagger
- Global Exception Middleware
- xUnit

### Frontend
- Angular 20
- Standalone Components
- Signals
- Reactive Forms
- HttpClient
- RxJS
- OnPush Change Detection
- Angular Control Flow (`@if`, `@for`)

<div dir="rtl" align="right">

## מבנה הפתרון

</div>

```
client/
    Angular 20 application
    src/app/
        core/            - API service, config, HTTP interceptor
        features/
            combination-generator/
                components/  - קומפוננטות UI קטנות (start-form, action-toolbar,
                               single-combination-view, combinations-page-view,
                               pagination-controls)
                pages/       - עמוד ראשי שמחבר facade לקומפוננטות
                services/    - CombinationGeneratorFacade (Signals-based state)
                models/      - טיפוסי בקשה/תגובה
        shared/          - קומפוננטות/utils משותפים (formatLargeNumber, validation utils)

server/
    CombinationGenerator.Api
        Controllers/     - endpoints דקים, ללא לוגיקה עסקית
        Contracts/       - Request/Response DTOs
        Mapping/         - מיפוי בין תוצאות Core ל-Response DTOs
        Middleware/      - ExceptionHandlingMiddleware
    CombinationGenerator.Core
        Algorithms/      - FactorialCalculator, PermutationByIndexCalculator,
                           LexicographicNextPermutationGenerator
        Services/        - CombinationService (כל הלוגיקה העסקית)
        Validation/      - CombinationRequestValidator
        Infrastructure/  - InMemoryCombinationSessionStore
        Abstractions/    - ICombinationService, ICombinationSessionStore
        Exceptions/      - AppException (בסיס) + BusinessValidationException,
                           SessionNotFoundException
        Models/          - Session ותוצאות פנימיות
    CombinationGenerator.Core.Tests
        Algorithms/      - בדיקות לשלושת האלגוריתמים
        Services/        - בדיקות אינטגרטיביות ל-CombinationService
        Validation/      - בדיקות ל-Validator
```

<div dir="rtl" align="right">

## ארכיטקטורה

הבחירה היא בשלוש שכבות בשרת: **Api / Core / Core.Tests**. לא נבנתה הפרדה נוספת בין "Application" ל-"Domain" בתוך Core, כי בסקאלה של הפרויקט הזה (endpoint יחיד עם session, כמה אלגוריתמים) הפרדה כזו הייתה מוסיפה indirection בלי תועלת ממשית. `CombinationService` מרכז גם את התיאום (start/next/browse) וגם קורא לאלגוריתמים הטהורים - שני התפקידים קטנים מספיק כדי לחיות יחד בבירור, בלי לפגוע בקריאות.

### Api
אחראית **רק** על: endpoints, Request/Response contracts, Dependency Injection, Middleware, Swagger, מיפוי תגובות. אין בה שום לוגיקה עסקית.

### Core
מכיל את כל הלוגיקה העסקית: אלגוריתמי פרמוטציה, ניהול Session, ולידציה, שירותים, מודלים, exceptions מותאמים. **אין תלות ב-ASP.NET** - ניתן להשתמש ב-Core הזה גם בהקשר אחר (CLI, worker וכו') בלי שינוי.

### Core.Tests
בדיקות יחידה ואינטגרציה לכל הרכיבים ב-Core (ראה סעיף בדיקות למטה).

## עקרונות עיצוב

- Separation of Concerns
- Single Responsibility Principle
- Dependency Inversion - כל תלות ב-Core מתבצעת מול ממשקים (`ICombinationSessionStore`, `ICombinationService`), לא מימושים קונקרטיים
- Stateless HTTP API עם State בצד שרת (per-session)
- אחסון In-Memory thread-safe

הפרויקט נמנע בכוונה מסיבוך מיותר לסקאלה הזו: CQRS, MediatR, Repository Pattern, AutoMapper - נשקלו ונמצאו לא נחוצים לגודל המשימה.

</div>

## State Management

כל משתמש מקבל `SessionId` (Guid) ייחודי. השרת שומר עבור כל session:

- `N`
- `CurrentIndex`
- `CurrentValues` (הפרמוטציה הנוכחית המלאה - נדרש כקלט ל-`NextPermutation`)
- `BrowseBaseIndex` (נקודת ההתחלה של מצב הדפדוף)
- `LastBrowseStartIndex`

האחסון מתבצע דרך `ICombinationSessionStore`, כרגע ממומש ב-`InMemoryCombinationSessionStore` באמצעות `ConcurrentDictionary<Guid, CombinationSession>` - כך שכל session מבודד ומאוחסן בצורה בטוחה מבחינת thread-safety ברמת ה-collection.

<div dir="rtl" align="right">

**הקליינט שומר רק State תצוגתי** - מצב מסך נוכחי, קומבינציה נוכחית, עמוד נוכחי, טעינה ושגיאות - דרך Angular Signals ב-`CombinationGeneratorFacade`. שום חישוב עסקי לא מתבצע בקליינט.

</div>

## Permutation Algorithms

בפועל נעשה שימוש בשני אלגוריתמים שונים, לפי הצורך:

### FactorialCalculator
מחשב `n!` באמצעות `BigInteger`, כדי לתמוך גם ב-n=20 (2,432,902,008,176,640,000 פרמוטציות) בלי איבוד דיוק.

### LexicographicNextPermutationGenerator
מקבל פרמוטציה קיימת ומחזיר את הבאה לקסיקוגרפית (swap + reverse קלאסי), ב-O(n). משמש **לכפתור "הבא"** (`GetNext`) - שם כבר יש לנו את הפרמוטציה הנוכחית ורוצים להתקדם צעד אחד. כשאין פרמוטציה הבאה, מחזיר מערך ריק.

### PermutationByIndexCalculator (Unranking)
מחשב פרמוטציה ישירות מתוך אינדקס סידורי (Factorial Number System), בלי תלות בפרמוטציה הקודמת ובלי לעבור על כל הפרמוטציות שלפניה. משמש **לחישוב הפריט הראשון בעמוד** ב-`GetPage` - שם נדרשת גישה אקראית לאינדקס שרירותי (עמוד 1,000,000 למשל).

<div dir="rtl" align="right">

### גישה היברידית ב-GetPage

בתוך `GetPage`, רק **הפריט הראשון** בעמוד מחושב עם Unranking (כי צריך לקפוץ לאינדקס שרירותי - `startIndex`). כל שאר פריטי העמוד מחושבים ע"י שרשור `LexicographicNextPermutationGenerator.GetNext` על הפריט הקודם - זול משמעותית (O(n) לכל צעד) מחישוב Unranking מלא לכל פריט בנפרד. כך נחסך רוב העבודה החוזרת שהייתה קיימת כשכל פריט חושב באופן עצמאי.

</div>

## Pagination

Pagination מתבצע כולו בצד שרת. הקליינט מבקש רק את העמוד הנדרש. עבור n גדול, כל חישובי העמוד מתבצעים עם `BigInteger` בשרת. ה-API מחליף ערכים מספריים גדולים כמחרוזות כדי למנוע overflow.

מטא-דאטה נוספת מוחזרת: `StartIndex`, `EndIndex`, `TotalPages` - כך שהקליינט יכול לשמר את המיקום הלוגי הנוכחי גם כשגודל העמוד משתנה (Resize).

<div dir="rtl" align="right">

### דיוק מספרים גדולים בצד קליינט

עבור n=20 יש 2,432,902,008,176,640,000 פרמוטציות - חורג מ-`Number.MAX_SAFE_INTEGER` של JavaScript. לכן:
- כל ערך גדול (`totalPermutations`, מספרי עמוד, אינדקסים) מוחזר מהשרת כ-`string`.
- כל חישוב אריתמטי על ערכים אלו בצד קליינט (למשל חישוב "עמוד אחרון") מתבצע עם `BigInt`, לא `Number`.
- תצוגת "סה״כ קומבינציות" מעוצבת עם מפרידי אלפים (`formatLargeNumber`) ישירות על ה-string, בלי המרה ל-`Number` - כדי לא לאבד דיוק.

</div>

## Validations

| מקום | חוקים |
|---|---|
| n (מסך פתיחה) | חובה, מספר שלם, בין 1 ל-20 |
| Next | לא נשלח אם אין session פעיל או אם `hasMore === false` |
| All Combinations | לא נשלח אם אין session פעיל או אם `hasMore === false`; מוצגת הודעה למשתמש |
| מספר עמוד | ריק / טקסט / 0 / שלילי / שבר → שגיאה בקליינט; חריגה מ-`totalPages` → 400 מהשרת |
| גודל עמוד | ערכים קבועים מראש (dropdown סגור) |

## Error Handling

<div dir="rtl" align="right">

### Backend

כל exceptions עסקיים יורשים מבסיס משותף - `AppException` - שמכיל `StatusCode`. ה-Global Exception Middleware תופס `AppException` בקאץ' אחד גנרי ומחזיר את קוד הסטטוס המתאים, ותופס בנפרד `Exception` לא-צפוי (רושם ל-`ILogger` ומחזיר 500).

</div>

- `BusinessValidationException` → HTTP 400
- `SessionNotFoundException` → HTTP 404
- Unhandled Exception → HTTP 500 (עם logging)

<div dir="rtl" align="right">

### Frontend
- HTTP interceptor פונקציונלי לטיפול מרוכז בשגיאות
- State של שגיאות/הודעות מנוהל ב-Facade (`errorMessage`, `infoMessage`)

</div>

## API Overview

```
POST /api/combinations/start
POST /api/combinations/next
POST /api/combinations/browse/page
POST /api/combinations/browse/resize
POST /api/combinations/browse/exit
POST /api/combinations/reset
```

Swagger זמין ב:
```
https://localhost:7055/swagger
```

## Testing

<div dir="rtl" align="right">

### Backend (xUnit)

- **FactorialCalculator** - ערכים רגילים, n=0, n=20, קלט שלילי
- **PermutationByIndexCalculator** - אינדקס ראשון/אחרון, חריגה מטווח, ייחודיות כל הפרמוטציות
- **LexicographicNextPermutationGenerator** - כולל הפרמוטציה האחרונה (מחזיר מערך ריק)
- **CombinationRequestValidator** - כל טווחי n ו-page
- **CombinationService** - בדיקות אינטגרטיביות מלאות: Start / Next / GetPage / ExitBrowse / Reset / ResizeBrowse, כולל edge cases

הרצה:
```bash
cd server
dotnet test
```

### Frontend (Vitest, דרך ה-unit-test builder הטבעי של Angular 20)

- `combination-generator.facade.spec.ts` - כל הזרימות המרכזיות (start/next/browse/reset/resize) + טיפול בשגיאות, עם mocking ל-API service
- בדיקות ל-utils (`formatLargeNumber`, validation utils)

הרצה:
```bash
cd client
ng test
```

</div>

## Running the Project

<div dir="rtl" align="right">

### Backend

</div>

```bash
cd server
dotnet restore
dotnet run
```

```
https://localhost:7055/swagger
```

<div dir="rtl" align="right">

### Frontend

</div>

```bash
cd client
npm install
ng serve
```

```
http://localhost:4200
```

## Key Design Decisions

<div dir="rtl" align="right">

- כל חישובי הפרמוטציות מתבצעים בצד שרת בלבד; הקליינט אף פעם לא מחשב פרמוטציה בעצמו.
- Sessions מאוחסנים מאחורי abstraction (`ICombinationSessionStore`) - מאפשר להחליף את המימוש ה-In-Memory ב-Redis בלי לשנות שום דבר ב-`CombinationService`.
- אינדקסים גדולים מיוצגים כ-`BigInteger` בשרת ומועברים כ-string דרך ה-API, ומטופלים כ-`BigInt` בקליינט לשמירת דיוק מלא.
- הארכיטקטורה מעדיפה פשטות וקריאות על פני "future-proofing" מוגזם - שלוש שכבות בשרת, לא ארבע, כי הפרויקט לא מצדיק את ה-indirection הנוסף בסקאלה הנוכחית.

</div>

## Future Improvements

<div dir="rtl" align="right">

- Redis-based session storage (דורש בעיקר: מימוש חדש ל-`ICombinationSessionStore` + שינוי רישום ה-DI ב-`Program.cs`, כולל TTL לסשנים לא פעילים)
- Distributed caching
- Persistent session recovery
- Authentication
- Monitoring and metrics
- בדיקות אינטגרציה end-to-end (מעבר ל-unit tests הקיימים), למשל עם `WebApplicationFactory`

</div>

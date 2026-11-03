<div align="center">

<h1 style="font-size: 3rem; font-weight: 800;">
	📚 BookNook / <font color="#315b45">A small online library</font>
</h1>

<h3 style="font-size: 1.1rem; font-weight: 700;"><font color="#315b45">B14-A8 · Cat_Ron · Community Book Sharing</font></h3>

<h2 style="font-size: 1.8rem; font-weight: 800;">Good books are even better when they’re shared.</h2>

Browse the community shelf, share a book you love, borrow a story for seven days, and pass it along when you’re done.

**Live Site:** <a href="https://b14-a8-cat-ron-book-nook-client-svk.vercel.app/" target="_blank" rel="noopener noreferrer">Open BookNook</a>

[![Live Site](https://img.shields.io/badge/Live%20Site-BookNook-315b45?style=for-the-badge)](https://b14-a8-cat-ron-book-nook-client-svk.vercel.app/)
[![Server API](https://img.shields.io/badge/Server%20API-Visit%20API-d09b56?style=for-the-badge)](https://b14-a8-cat-ron-book-nook-server-svk.vercel.app/)

</div>

---

## 🔗 Project Links

| Resource | Link |
| --- | --- |
| 🌐 **Live website** | [b14-a8-cat-ron-book-nook-client-svk.vercel.app](https://b14-a8-cat-ron-book-nook-client-svk.vercel.app/) |
| ⚙️ **Live API** | [b14-a8-cat-ron-book-nook-server-svk.vercel.app](https://b14-a8-cat-ron-book-nook-server-svk.vercel.app/) |
| 💻 **Client repository** | [SVKSharma/B14-A8-Cat-Ron-BookNook-Client](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Client) |
| 🗄️ **Server repository** | [SVKSharma/B14-A8-Cat-Ron-BookNook-Server](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Server) |

> **This is the frontend repository.** The Express + MongoDB API that powers BookNook lives in the [server repository](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Server). You will need both projects running locally for the full experience.

---

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">About BookNook</font></h2>

BookNook is a warm, community-driven online library built with the Next.js App Router, TypeScript, Better Auth, MongoDB, Tailwind CSS, and Swiper. It gives readers one calm place to discover books, add books they own, borrow a book for seven days, and return it for the next reader.

The interface pairs a cozy editorial look with practical tools: live search, category filters, protected account pages, cover uploads, borrowing history, and clear success and error feedback. Every page is responsive, every destructive action asks for confirmation, and the whole experience is designed around one simple idea:

> **Add a book, borrow a book, return a book.**

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🌟 Key Features</font></h2>

- **Swiper.js hero carousel:** Three animated slides with titles, short descriptions, and a “Browse Books” call to action, complete with autoplay, pagination, and previous/next controls.
- **Dynamic new arrivals:** The home page loads the latest six books from the API, newest first, using a MongoDB sort and limit.
- **Community bookshelf:** A responsive three-column catalogue with live search by title, author, or description, plus category filtering and a clear-filters action.
- **Detailed book pages:** Each book has a large cover, title, author, category, description, contributor information, and a clear borrow action.
- **Secure authentication:** Email/password sign-up and sign-in plus Google OAuth, powered by Better Auth and the MongoDB adapter.
- **Password safeguards:** Registration enforces at least six characters, one uppercase letter, and one lowercase letter through Zod and React Hook Form.
- **Protected routes with callback support:** Add Book, My Books, My Borrows, and Profile are guarded by a Next.js proxy and server-side session checks. Signed-out readers are sent to sign in and returned to their original page afterward.
- **JWT-backed API access:** Better Auth issues a seven-day JWT that the client sends as a Bearer token to the Express API. The token is also synced to a secure HttpOnly cookie for server-rendered requests.
- **Add a book with image upload:** Signed-in readers can add a title, author, ISBN-13, category, description, and cover image. Covers are uploaded through a protected Next.js route to ImgBB.
- **Duplicate and ISBN protection:** The form checks for duplicate listings and conflicting ISBN/title/author combinations before creating a book.
- **My Books management:** Contributors can see only their own books, edit existing details, and remove a book after a custom confirmation dialog.
- **Borrow and return flow:** A “Borrow this book” action creates a borrow record with a seven-day due date. Readers cannot borrow the same book twice, and My Borrows shows due dates with a return action.
- **Reader profile:** Signed-in readers can view their display name, email address, and profile photo.
- **Toast-based feedback:** Success and error messages use an accessible toast system instead of browser alerts.
- **Dark and light themes:** A navbar theme toggle persists the reader’s preference with `next-themes`.
- **Loading skeletons and polished states:** Home, catalogue, details, profile, and protected pages include dedicated loading skeletons, empty states, and friendly error states.
- **Custom 404 and error pages:** Both include clear recovery actions instead of default framework screens.
- **Route-specific page titles:** Metadata is defined per route, for example “BookNook | All Books”.
- **Fully responsive layout:** The navigation, grids, forms, and tables adapt cleanly across mobile, tablet, and desktop.
- **Accessible UI details:** Semantic landmarks, labelled controls, keyboard-friendly dialogs, focus styles, and reduced-motion-aware animations are used throughout.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🔐 Authentication & Security</font></h2>

BookNook uses **Better Auth** with the **MongoDB adapter** for account storage and sessions.

1. Readers register with name, email, optional photo URL, and password, or continue with Google.
2. Better Auth stores users and sessions in MongoDB.
3. A Better Auth **JWT plugin** issues a seven-day token with the reader’s email and name.
4. Client components request the token through `getBrowserAccessToken()` and send it to the API as `Authorization: Bearer <token>`.
5. `/api/auth/token-cookie` stores the same token in an **HttpOnly** cookie so server components can make authenticated API calls.
6. The Express API verifies the token against Better Auth’s JWKS endpoint using `jose`, then enforces ownership for updates, deletes, and borrow records.

The API never trusts a client-supplied email for identity. It derives the reader’s email from the verified JWT, which keeps each person’s shelf and borrow history private.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🛠️ Technologies Used</font></h2>

- **Framework:** Next.js 16 App Router, React 19, React DOM
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui, Base UI, tw-animate-css
- **UI Components:** shadcn/ui, Base UI, Lucide React, React Icons
- **Carousel:** Swiper 14
- **Authentication:** Better Auth, `@better-auth/mongo-adapter`, Better Auth JWT plugin
- **Database:** MongoDB (official driver)
- **Forms & Validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Data Fetching:** Next.js Server Components, native `fetch`, typed API helpers
- **Theming:** `next-themes`
- **Dates & utilities:** date-fns, class-variance-authority, `cn`
- **Image handling:** Next Image, ImgBB uploads through a protected route
- **Linting:** ESLint, `eslint-config-next`
- **Deployment:** Vercel

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🧭 Routes</font></h2>

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero carousel, new arrivals, borrowing guide, and reader reviews |
| `/books` | Public | Searchable, filterable catalogue of every shared book |
| `/books/[id]` | Public | Book details; borrowing redirects signed-out readers to sign in |
| `/signin` | Public | Email/password and Google sign-in |
| `/signup` | Public | Account registration with password validation |
| `/add-book` | Protected | Add a book with a cover image |
| `/my-books` | Protected | View, edit, and delete books added by the reader |
| `/my-books/[id]/edit` | Protected | Edit an existing listing |
| `/my-borrows` | Protected | View borrowed books, due dates, and return them |
| `/profile` | Protected | Reader profile and account details |

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🔌 API Integration</font></h2>

The client talks to the BookNook Express API through `src/lib/api.ts`.

| Method | Endpoint | Auth | Used for |
| --- | --- | --- | --- |
| `GET` | `/books?limit=6` | Public | Home page new arrivals |
| `GET` | `/books` | Public | Full catalogue |
| `GET` | `/books/:id` | Public | Book details |
| `GET` | `/books?email=...` | Bearer JWT | My Books filtering |
| `POST` | `/books` | Bearer JWT | Add a book |
| `PATCH` | `/books/:id` | Bearer JWT + owner | Edit a book |
| `DELETE` | `/books/:id` | Bearer JWT + owner | Delete a book |
| `GET` | `/borrows?email=...` | Bearer JWT | My Borrows |
| `POST` | `/borrows` | Bearer JWT | Borrow a book |
| `DELETE` | `/borrows/:id` | Bearer JWT + owner | Return a book |

Full API documentation, data models, and authentication details are available in the [server repository](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Server).

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">📂 Project Structure</font></h2>

```text
book-nook/
├── public/
├── src/
│   ├── app/
│   │   ├── (protected)/
│   │   │   ├── add-book/
│   │   │   ├── my-books/
│   │   │   │   └── [id]/edit/
│   │   │   ├── my-borrows/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...all]/route.ts
│   │   │   │   └── token-cookie/route.ts
│   │   │   └── upload/route.ts
│   │   ├── books/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── books/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── providers/
│   │   ├── shared/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── auth-token-client.ts
│   │   ├── auth-token-server.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── validations.ts
│   └── proxy.ts
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🚀 Getting Started</font></h2>

Follow these steps to run the BookNook client locally.

### 1. Clone the repository

Using HTTPS:

```bash
git clone https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Client.git
cd B14-A8-Cat-Ron-BookNook-Client
```

Using SSH:

```bash
git clone git@github.com:SVKSharma/B14-A8-Cat-Ron-BookNook-Client.git
cd B14-A8-Cat-Ron-BookNook-Client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create `.env.local` in the project root:

```bash
MONGODB_CONNECTION_STRING_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
Google_OAuth_Client_ID=your_google_client_id
Google_OAuth_Client_Secret=your_google_client_secret
IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_CONNECTION_STRING_URI` | Yes | MongoDB Atlas connection string used by Better Auth |
| `BETTER_AUTH_URL` | Yes | Public origin of this app; also used for metadata, JWT issuer, and JWT audience |
| `Google_OAuth_Client_ID` | Yes for Google sign-in | Google OAuth client ID |
| `Google_OAuth_Client_Secret` | Yes for Google sign-in | Google OAuth client secret |
| `IMGBB_API_KEY` | Yes for cover uploads | ImgBB API key used by `/api/upload` |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the BookNook Express API |

### 4. Configure Google OAuth

Add this authorized redirect URI in the Google Cloud console:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add the equivalent URL using your deployed client origin.

### 5. Start the development server

```bash
npm run dev
```

### 6. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000).

Make sure the [BookNook server](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Server) is running on `http://localhost:5000`, or update `NEXT_PUBLIC_API_URL` to point at the live API.

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🧪 Available Scripts</font></h2>

```bash
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">🌐 Deployment</font></h2>

The client is deployed on **Vercel**.

1. Import the [client repository](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Client) into Vercel.
2. Add every variable from `.env.local` to the Vercel project settings.
3. Set `BETTER_AUTH_URL` to the production client URL, for example `https://b14-a8-cat-ron-book-nook-client-svk.vercel.app`.
4. Set `NEXT_PUBLIC_API_URL` to the live API URL: `https://b14-a8-cat-ron-book-nook-server-svk.vercel.app`.
5. Add the production Google callback URL: `https://b14-a8-cat-ron-book-nook-client-svk.vercel.app/api/auth/callback/google`.
6. Deploy.

The matching server deployment instructions are in the [server README](https://github.com/SVKSharma/B14-A8-Cat-Ron-BookNook-Server).

<h2 style="font-size: 1.5rem; font-weight: 800;"><font color="#315b45">✅ Project Notes</font></h2>

- A borrow is due **seven days** after it is created.
- Readers cannot borrow the same book twice while it is still on their borrow list.
- Readers cannot borrow a book they added themselves.
- Book covers are limited to JPG, PNG, WEBP, or GIF files up to 10 MB.
- The client never uses browser `alert()` or `confirm()` for application feedback.
- Authenticated pages survive a full page reload without bouncing signed-in readers back to sign-in.

Thank you for exploring BookNook. This project was built for the **B14-A8** assignment while extending the baseline with JWT-secured API access, protected server-rendered pages, ImgBB cover uploads, duplicate protection, and a calm, responsive reading experience.

---

<div align="center">

Built with 💚 by <a href="https://github.com/SVKSharma">Showvik</a>

</div>

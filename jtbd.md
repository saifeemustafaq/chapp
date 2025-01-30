**High Priority (Core Structure)**
1. **Client-side Tasks**
   - [x] Remove duplicate `socket.js` from client root, ensure all socket logic is in `services/socket.js`
   - [x] Create `router/index.js` for Vue Router configuration
   - [x] Set up state management in `store/index.js` (Vuex/Pinia)
   - [x] Add base layout in `layouts/DefaultLayout.vue`

2. **Server-side Tasks**
   - [x] Create essential models in `models` directory:
     - `User.js` (using users.json currently)
     - `Message.js`
     - `Chat.js`
   - [ ] Add validation schemas directory:
     - `schemas/auth.js`
     - `schemas/message.js`
   - [x] Complete middleware setup:
     - `middleware/auth.js`
     - `middleware/error.js`
     - `middleware/validation.js`

**Medium Priority (Enhancement)**
3. **Testing & Type Safety**
   - [ ] Add `tests` directories in both client and server
   - [ ] Create `types` or `interfaces` directories if using TypeScript
   - [ ] Add TypeScript configurations (if using TS):
     - `tsconfig.json` for both client and server

4. **Environment & Configuration**
   - [x] Create `.env.example` files for both client and server
   - [x] Add environment variable validation

**Lower Priority (Additional Features)**
5. **Documentation & DevOps**
   - [ ] Create `docs` directory for API documentation
   - [ ] Add `docker` directory with:
     - `Dockerfile`
     - `docker-compose.yml`
   - [x] Create deployment configurations:
     - Added `vercel.json`
     - Added `netlify.toml`

6. **Client Enhancements**
   - [ ] Add `composables` directory for reusable Vue composition functions
   - [ ] Create `utils/validators.js` for form validation
   - [x] Add `constants` directory for frontend constants (implemented in shared/constants.js)


Let's make an admin panel, that manages the the user sam and tam

Do the following changes:
add an admin button, the button should be there, but invisible, it should be on the top left corner of the home page, 

Clicking on admin button, asks me for an ID and password.
Id would be adminmustafa
password would be mustafaadmin, this should be hard coded and something that can only be changed from logging inside the admin portal

Logging in, it will show the two users Sam and Tam, and give options to either change the username, or a reset password button which will generate a temporary password, and using this temporary password, the users can 
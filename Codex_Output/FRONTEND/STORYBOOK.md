# 📚 Storybook Documentation - Litigation Management System

## 📊 **Storybook Overview**

The **Litigation Management System** includes **Storybook 7.6.6** for component development, testing, and documentation. Storybook provides an isolated environment for developing and showcasing React components with comprehensive addon support for accessibility, documentation, and interaction testing.

### **Storybook Configuration**

| Component | Version | Purpose | Evidence |
|-----------|---------|---------|----------|
| **Storybook Core** | 7.6.6 | Component development environment | `package.json:L100` |
| **React Integration** | 7.6.6 | React component support | `package.json:L72` |
| **Vite Integration** | 7.6.6 | Vite build system integration | `package.json:L73` |
| **Essential Addons** | 7.6.6 | Core Storybook functionality | `package.json:L68` |

## 🛠️ **Storybook Addons**

### **Core Addons**

| Addon | Version | Purpose | Evidence |
|-------|---------|---------|----------|
| **@storybook/addon-essentials** | 7.6.6 | Core Storybook functionality | `package.json:L68` |
| **@storybook/addon-docs** | 7.6.6 | Component documentation | `package.json:L67` |
| **@storybook/addon-links** | 7.6.6 | Component linking | `package.json:L70` |
| **@storybook/addon-interactions** | 7.6.6 | Interaction testing | `package.json:L69` |

### **Specialized Addons**

| Addon | Version | Purpose | Evidence |
|-------|---------|---------|----------|
| **@storybook/addon-a11y** | 7.6.6 | Accessibility testing | `package.json:L66` |
| **@storybook/blocks** | 7.6.6 | Documentation blocks | `package.json:L71` |
| **@storybook/test** | 7.6.6 | Testing utilities | `package.json:L74` |

## 📁 **Storybook Structure**

### **Configuration Files**

| File | Purpose | Evidence |
|------|---------|----------|
| `.storybook/main.js` | Main Storybook configuration | `.storybook/main.js` |
| `.storybook/preview.js` | Global story configuration | `.storybook/preview.js` |
| `.storybook/manager.js` | Storybook manager configuration | `.storybook/manager.js` |

### **Story Files**

| Component | Story File | Purpose | Evidence |
|-----------|------------|---------|----------|
| **MixedContentInput** | `MixedContentInput.stories.tsx` | Form input stories | `src/components/forms/MixedContentInput.stories.tsx` |
| **FormInput** | `FormInput.stories.tsx` | Input component stories | `src/components/FormInput.stories.tsx` |
| **LanguageSwitcher** | `LanguageSwitcher.stories.tsx` | Language switcher stories | `src/components/LanguageSwitcher.stories.tsx` |

## 🎨 **Component Stories**

### **MixedContentInput Stories**

| Story | Purpose | Props | Evidence |
|-------|---------|-------|----------|
| **Default** | Basic mixed content input | `value`, `onChange`, `placeholder` | `src/components/forms/MixedContentInput.stories.tsx` |
| **Arabic Text** | Arabic text input | `value: "نص عربي"`, `direction: "rtl"` | `src/components/forms/MixedContentInput.stories.tsx` |
| **English Text** | English text input | `value: "English text"`, `direction: "ltr"` | `src/components/forms/MixedContentInput.stories.tsx` |
| **Mixed Content** | Arabic/English mixed content | `value: "Mixed نص content"` | `src/components/forms/MixedContentInput.stories.tsx` |
| **With Error** | Input with validation error | `error: "Required field"` | `src/components/forms/MixedContentInput.stories.tsx` |
| **Disabled** | Disabled input state | `disabled: true` | `src/components/forms/MixedContentInput.stories.tsx` |

### **FormInput Stories**

| Story | Purpose | Props | Evidence |
|-------|---------|-------|----------|
| **Default** | Basic form input | `label`, `type`, `value` | `src/components/FormInput.stories.tsx` |
| **Text Input** | Text input field | `type: "text"`, `label: "Name"` | `src/components/FormInput.stories.tsx` |
| **Email Input** | Email input field | `type: "email"`, `label: "Email"` | `src/components/FormInput.stories.tsx` |
| **Password Input** | Password input field | `type: "password"`, `label: "Password"` | `src/components/FormInput.stories.tsx` |
| **With Error** | Input with validation error | `error: "Invalid input"` | `src/components/FormInput.stories.tsx` |
| **Required Field** | Required input field | `required: true` | `src/components/FormInput.stories.tsx` |

### **LanguageSwitcher Stories**

| Story | Purpose | Props | Evidence |
|-------|---------|-------|----------|
| **Default** | Basic language switcher | None | `src/components/LanguageSwitcher.stories.tsx` |
| **Arabic Selected** | Arabic language selected | `currentLanguage: "ar"` | `src/components/LanguageSwitcher.stories.tsx` |
| **English Selected** | English language selected | `currentLanguage: "en"` | `src/components/LanguageSwitcher.stories.tsx` |
| **RTL Mode** | RTL layout mode | `isRTL: true` | `src/components/LanguageSwitcher.stories.tsx` |
| **LTR Mode** | LTR layout mode | `isRTL: false` | `src/components/LanguageSwitcher.stories.tsx` |

## 🧪 **Testing Integration**

### **Visual Testing**

| Feature | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **Chromatic Integration** | Visual regression testing | Component visual consistency | `.storybook/main.js` |
| **Screenshot Testing** | Automated screenshots | Visual change detection | `.storybook/preview.js` |
| **Cross-browser Testing** | Multiple browser support | Browser compatibility | `.storybook/preview.js` |

### **Accessibility Testing**

| Feature | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **A11y Addon** | Accessibility testing | WCAG compliance | `package.json:L66` |
| **Screen Reader Testing** | ARIA support testing | Accessibility validation | `.storybook/preview.js` |
| **Keyboard Navigation** | Keyboard accessibility | Navigation testing | `.storybook/preview.js` |

### **Interaction Testing**

| Feature | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **User Events** | User interaction simulation | Component behavior testing | `package.json:L69` |
| **Form Testing** | Form interaction testing | Form validation testing | `.storybook/preview.js` |
| **State Management** | Component state testing | State change validation | `.storybook/preview.js` |

## 🌐 **RTL Support in Storybook**

### **RTL Configuration**

| Setting | Value | Purpose | Evidence |
|---------|-------|---------|----------|
| **RTL Stories** | Separate RTL stories | RTL component testing | `.storybook/preview.js` |
| **Direction Switching** | Dynamic direction change | RTL/LTR testing | `.storybook/preview.js` |
| **Arabic Content** | Arabic text examples | Arabic content testing | `src/components/forms/MixedContentInput.stories.tsx` |

### **RTL Story Examples**

| Component | RTL Story | Purpose | Evidence |
|-----------|-----------|---------|----------|
| **MixedContentInput** | Arabic text input | RTL text input testing | `src/components/forms/MixedContentInput.stories.tsx` |
| **FormInput** | RTL form layout | RTL form testing | `src/components/FormInput.stories.tsx` |
| **LanguageSwitcher** | RTL mode switcher | RTL switching testing | `src/components/LanguageSwitcher.stories.tsx` |

## 📖 **Documentation Features**

### **Auto-generated Documentation**

| Feature | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **Props Documentation** | Automatic prop documentation | Component API documentation | `package.json:L67` |
| **Usage Examples** | Code examples | Component usage guidance | `.storybook/preview.js` |
| **Design Guidelines** | Design system documentation | Design consistency | `.storybook/preview.js` |

### **Interactive Documentation**

| Feature | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **Controls Panel** | Interactive prop controls | Component testing | `package.json:L68` |
| **Actions Panel** | Event logging | Component interaction tracking | `package.json:L68` |
| **Viewport Testing** | Responsive testing | Mobile/desktop testing | `package.json:L68` |

## 🚀 **Storybook Scripts**

### **Development Scripts**

| Script | Command | Purpose | Evidence |
|--------|---------|---------|----------|
| **Start Storybook** | `npm run storybook` | Development server | `package.json:L32` |
| **Build Storybook** | `npm run build-storybook` | Production build | `package.json:L33` |
| **RTL Storybook** | `npm run storybook:rtl` | RTL-specific stories | `package.json:L34` |

### **Storybook Configuration**

| Setting | Value | Purpose | Evidence |
|---------|-------|---------|----------|
| **Port** | 6006 | Development server port | `package.json:L32` |
| **Build Output** | `storybook-static/` | Static build output | `package.json:L33` |
| **RTL Config** | `.storybook-rtl/` | RTL-specific configuration | `package.json:L34` |

## 🔧 **Storybook Setup**

### **Enablement Plan**

Since Storybook is already configured but may need additional stories, here's a comprehensive enablement plan:

#### **1. Core Component Stories (Priority 1)**

```typescript
// src/components/FormInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FormInput } from './FormInput';

const meta: Meta<typeof FormInput> = {
  title: 'Components/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
    },
    required: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    error: 'Please enter a valid email',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    type: 'password',
    required: true,
  },
};
```

#### **2. RTL Component Stories (Priority 2)**

```typescript
// src/components/forms/MixedContentInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MixedContentInput } from './MixedContentInput';

const meta: Meta<typeof MixedContentInput> = {
  title: 'Components/MixedContentInput',
  component: MixedContentInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ArabicText: Story = {
  args: {
    value: 'نص عربي',
    placeholder: 'أدخل النص',
    direction: 'rtl',
  },
};

export const EnglishText: Story = {
  args: {
    value: 'English text',
    placeholder: 'Enter text',
    direction: 'ltr',
  },
};

export const MixedContent: Story = {
  args: {
    value: 'Mixed نص content',
    placeholder: 'Enter mixed content',
  },
};
```

#### **3. Layout Component Stories (Priority 3)**

```typescript
// src/components/layout/Navbar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebarCollapsed: false,
  },
};

export const Collapsed: Story = {
  args: {
    sidebarCollapsed: true,
  },
};
```

### **Setup Steps**

1. **Install Storybook** (already done): `npm install storybook`
2. **Create Story Files**: Add stories for each component
3. **Configure RTL Support**: Set up RTL-specific stories
4. **Add Accessibility Testing**: Configure a11y addon
5. **Set up Visual Testing**: Configure Chromatic integration

### **Example Story Structure**

```
src/
├── components/
│   ├── FormInput.stories.tsx
│   ├── forms/
│   │   └── MixedContentInput.stories.tsx
│   ├── layout/
│   │   ├── Navbar.stories.tsx
│   │   ├── Sidebar.stories.tsx
│   │   └── Layout.stories.tsx
│   └── ui/
│       └── LanguageSwitcher.stories.tsx
```

## 📊 **Storybook Coverage**

### **Current Coverage**

| Component Category | Stories | Coverage | Evidence |
|-------------------|---------|----------|----------|
| **Form Components** | 2 stories | Partial | `src/components/forms/MixedContentInput.stories.tsx` |
| **Layout Components** | 0 stories | None | `src/components/layout/` |
| **UI Components** | 0 stories | None | `src/components/ui/` |
| **Page Components** | 0 stories | None | `src/pages/` |

### **Recommended Coverage**

| Component Category | Priority | Stories Needed | Evidence |
|-------------------|----------|----------------|----------|
| **Form Components** | High | 5+ stories | `src/components/forms/` |
| **Layout Components** | High | 4 stories | `src/components/layout/` |
| **UI Components** | Medium | 3 stories | `src/components/ui/` |
| **Table Components** | Medium | 2 stories | `src/components/tables/` |
| **Auth Components** | Low | 3 stories | `src/components/auth/` |

## 🎯 **Storybook Best Practices**

### **Story Organization**

| Pattern | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **Component Grouping** | `Components/FormInput` | Logical organization | `.storybook/main.js` |
| **Story Naming** | Descriptive names | Clear story purpose | `src/components/forms/MixedContentInput.stories.tsx` |
| **Args Documentation** | Comprehensive argTypes | Component API clarity | `src/components/forms/MixedContentInput.stories.tsx` |

### **Testing Integration**

| Feature | Implementation | Purpose | Evidence |
|---------|----------------|---------|----------|
| **Visual Regression** | Chromatic integration | Visual consistency | `.storybook/preview.js` |
| **Accessibility Testing** | A11y addon | WCAG compliance | `package.json:L66` |
| **Interaction Testing** | User events | Component behavior | `package.json:L69` |

---

**Evidence Summary**: `package.json:L100`, `package.json:L66-L74`, `src/components/forms/MixedContentInput.stories.tsx`, `.storybook/`, `package.json:L32-L34`

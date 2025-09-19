import type { Meta, StoryObj } from '@storybook/react';
import { MixedContentInput } from './MixedContentInput';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof MixedContentInput> = {
  title: 'Forms/MixedContentInput',
  component: MixedContentInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form input component that automatically handles RTL/LTR direction based on content and field type.',
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ width: '300px' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    value: {
      control: 'text',
      description: 'The input value',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when input value changes',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'password', 'url'],
      description: 'Input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether input is required',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum input length',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Enter text here...',
    type: 'text',
  },
};

export const WithArabicText: Story = {
  args: {
    value: 'ناجي رمضان',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'أدخل النص هنا...',
    type: 'text',
  },
};

export const WithMixedContent: Story = {
  args: {
    value: 'ناجي Smith',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Mixed content...',
    type: 'text',
  },
};

export const EmailField: Story = {
  args: {
    value: 'test@example.com',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'example@domain.com',
    type: 'email',
  },
};

export const PhoneField: Story = {
  args: {
    value: '+966501234567',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: '+966501234567',
    type: 'tel',
  },
};

export const PasswordField: Story = {
  args: {
    value: 'password123',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Password',
    type: 'password',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled input',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Disabled input',
    type: 'text',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Required field',
    type: 'text',
    required: true,
  },
};

export const WithMaxLength: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Max 10 characters',
    type: 'text',
    maxLength: 10,
  },
};

export const ArabicClientName: Story = {
  args: {
    value: 'ناجي رمضان أحمد',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'اسم العميل',
    type: 'text',
  },
};

export const EnglishClientName: Story = {
  args: {
    value: 'John Smith',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Client Name',
    type: 'text',
  },
};

export const MixedClientName: Story = {
  args: {
    value: 'ناجي Smith',
    onChange: (value) => console.log('Value changed:', value),
    placeholder: 'Client Name / اسم العميل',
    type: 'text',
  },
};

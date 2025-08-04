# Contributing to GEOforge

Thank you for your interest in contributing to GEOforge! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

We welcome contributions from the community! Here are the main ways you can help:

### 🐛 Report Bugs
- Use the [GitHub Issues](../../issues) page
- Include detailed steps to reproduce
- Provide your environment details
- Include screenshots if applicable

### 💡 Suggest Features
- Use the [GitHub Discussions](../../discussions) page
- Describe the feature and its benefits
- Consider implementation complexity
- Check if similar features exist

### 🔧 Submit Code Changes
- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request

### 📚 Improve Documentation
- Fix typos and grammar
- Add missing information
- Improve clarity and structure
- Update examples and guides

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Modern web browser

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/geoforge.git
   cd geoforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when available)

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` type when possible
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Follow naming conventions (PascalCase)
- Keep components focused and reusable
- Use proper prop types

### CSS/Styling
- Use Tailwind CSS for styling
- Follow utility-first approach
- Maintain responsive design
- Ensure accessibility compliance

### File Organization
- Group related files together
- Use descriptive file names
- Follow the existing folder structure
- Keep files focused and small

## 🔍 Code Review Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass (when available)
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Commit messages are clear

### Pull Request Guidelines
- Use descriptive titles
- Include detailed descriptions
- Reference related issues
- Add screenshots for UI changes
- Keep PRs focused and small

### Review Checklist
- [ ] Code is readable and well-documented
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility

## 🧪 Testing

### Unit Tests
- Write tests for new features
- Maintain good test coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Test component interactions
- Verify file generation logic
- Test error handling
- Validate user workflows

### Manual Testing
- Test in multiple browsers
- Verify responsive design
- Check accessibility features
- Test with different data sets

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Explain non-obvious decisions
- Keep comments up to date

### User Documentation
- Update README when needed
- Add usage examples
- Document new features
- Keep guides current

### API Documentation
- Document public APIs
- Provide usage examples
- Explain parameters and return values
- Include error handling

## 🎨 Design Guidelines

### UI/UX Principles
- Follow accessibility guidelines (WCAG 2.1 AA)
- Maintain consistent design language
- Prioritize user experience
- Consider mobile-first design

### Component Design
- Make components reusable
- Use proper semantic HTML
- Implement keyboard navigation
- Add proper ARIA labels

### Visual Design
- Follow existing color scheme
- Use consistent spacing
- Maintain visual hierarchy
- Ensure good contrast ratios

## 🚀 Adding New Features

### AI Platform Support
1. Research the platform's requirements
2. Add platform configuration
3. Implement manifest generation
4. Update documentation
5. Add tests

### File Generation
1. Define file format requirements
2. Implement generation logic
3. Add validation
4. Update UI components
5. Test with sample data

### CLI Features
1. Define command structure
2. Implement core logic
3. Add help documentation
4. Test with various inputs
5. Update main CLI file

## 🐛 Bug Fixes

### Reporting Bugs
- Use the issue template
- Include reproduction steps
- Provide environment details
- Add relevant logs/screenshots

### Fixing Bugs
- Reproduce the issue locally
- Identify the root cause
- Implement the fix
- Add regression tests
- Update documentation if needed

## 📋 Issue Labels

We use the following labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Important issues
- `priority: low` - Nice to have
- `type: ai-platform` - AI platform related
- `type: cli` - Command line interface
- `type: ui` - User interface related

## 🤝 Community Guidelines

### Be Respectful
- Treat others with respect
- Be constructive in feedback
- Avoid personal attacks
- Welcome newcomers

### Be Helpful
- Answer questions when you can
- Share knowledge and resources
- Mentor new contributors
- Celebrate others' contributions

### Be Professional
- Use clear communication
- Follow project conventions
- Respect maintainers' time
- Be patient with responses

## 🏆 Recognition

### Contributors
- All contributors are listed in the README
- Significant contributions get special recognition
- We highlight community members regularly

### Hall of Fame
- Top contributors are featured
- Special achievements are celebrated
- Community milestones are shared

## 📞 Getting Help

### Questions
- Use [GitHub Discussions](../../discussions)
- Check existing documentation
- Search previous issues
- Ask in community channels

### Stuck on Something?
- Don't hesitate to ask for help
- Provide context and details
- Show what you've tried
- Be patient for responses

## 🎉 Thank You

Thank you for contributing to GEOforge! Every contribution, no matter how small, helps make the project better for everyone.

---

**Happy coding! 🚀** 
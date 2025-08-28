# Rholang Documentation Project Guidelines

## Project Context
- This is a GitHub Pages documentation site for the Rholang programming language
- Rholang is a reflective, higher-order process calculus designed for blockchain and distributed computing
- The site provides comprehensive documentation, tutorials, examples, and reference materials for Rholang developers
- This project will use Jekyll or similar static site generator for GitHub Pages deployment
- Focus on clear, accessible documentation with practical examples and learning resources
- All code produced by the F1r3fly-io organization uses the Apache License
- The code and the documentation in this repository and organzation are developed by the **F1r3fly.io Limited Cooperative Association** -- not the RCHAIN Coop

## Project Structure
- Keep the current project structure up to date in the [README.md](./README.md)
- **Documentation Structure**:
  - `docs/` - Main documentation content
    - `docs/getting-started/` - Installation, setup, and first steps
    - `docs/language-guide/` - Core language concepts and syntax
    - `docs/tutorials/` - Step-by-step learning materials
    - `docs/examples/` - Practical code examples and use cases
    - `docs/reference/` - Complete language reference and API docs
    - `docs/advanced/` - Advanced topics and patterns
  - `_includes/` - Reusable template components
  - `_layouts/` - Page layout templates
  - `_sass/` - Styling and CSS
  - `assets/` - Images, diagrams, and other static assets

## Commands
- Local development: `bundle exec jekyll serve` or equivalent static site generator
- Build: `bundle exec jekyll build` or equivalent
- Install dependencies: `bundle install` or equivalent package manager
- DO NOT ever `git add`, `git rm` or `git commit, or git push` code. Allow the Claude user to always manually review git changes
- **Operating outside of local repository (with .git/ directory root)**: Not permitted and any file or other operations require user approval and notification

## Content Guidelines
- **Markdown**: Use Markdown for all documentation content with proper frontmatter
- **Code Examples**: Include working Rholang code examples with syntax highlighting
- **Clear Structure**: Organize content logically from basic to advanced concepts
- **Cross-References**: Link between related concepts and sections
- **Accessibility**: Ensure content is accessible with proper headings and alt text
- **Consistency**: Maintain consistent terminology and formatting throughout
- **Terse**: Focus on clear and concise examples without use of emoticons or other distracting text

## Documentation Best Practices
- Start with user needs and learning objectives
- Provide both conceptual explanations and practical examples
- Include code samples that can be copied and executed
- Use clear, concise language avoiding unnecessary jargon
- Structure content with proper headings and navigation
- Include diagrams and visual aids where helpful
- Test all code examples for accuracy
- Maintain up-to-date information with version references

## Rholang-Specific Content Areas
- **Language Fundamentals**: Process calculus concepts, channel operations, pattern matching
- **Syntax Reference**: Complete grammar and language constructs
- **RSpace++**: Execution environment concepts and execution model
- **Blockchain Integration**: RChain platform integration and deployment
- **Smart Contracts**: Contract development patterns and examples
- **Concurrency Patterns**: Parallel and concurrent programming techniques
- **Standard Library**: Built-in functions and utilities
- **Tooling**: Development tools, compilers, and debugging resources

## GitHub Pages Configuration
- Configure `_config.yml` for Jekyll settings and site metadata
- Use appropriate theme for technical documentation
- Configure navigation structure and site organization
- Set up proper URL structure and routing
- Implement search functionality for documentation
- Configure syntax highlighting for Rholang code blocks

## Content Quality Standards
- All code examples must be syntactically correct and executable
- Explanations should be clear to developers new to process calculus
- Include both simple and complex examples for each concept
- Provide migration guides for different Rholang versions
- Maintain glossary of terms and concepts
- Regular review and updates to ensure accuracy

## Common Tasks
- Review existing Rholang documentation and resources for accuracy
- Create clear learning paths for different user types (beginners, experienced developers)
- Develop practical tutorials with real-world applications
- Maintain code example repository with working samples
- Update documentation when language features change
- Ensure all internal links are working and up-to-date

## Technical Considerations
- **Performance**: Optimize for fast loading and navigation
- **SEO**: Implement proper meta tags and structured data
- **Mobile**: Ensure responsive design for mobile devices  
- **Search**: Include site search functionality
- **Analytics**: Track usage patterns to improve content
- **Versioning**: Handle multiple versions of language documentation

## Security and Maintenance
- Follow GitHub Pages security best practices
- Regular dependency updates for Jekyll and plugins
- Monitor for broken links and outdated information
- Backup important content and maintain version control
- Never include sensitive information or private keys in documentation

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

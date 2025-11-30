# Bootstrap Layout Guide

## Common Patterns in This Codebase

### 1. Page Container
**Pattern**: `<Container className="mt-3 my-md-4">`
- **Use**: `<PageContainer>` component instead
- **Why**: Consistent spacing, less repetition
- **Example**: Already refactored in most pages

### 2. Full-Width Columns
**Pattern**: `<Col xs={12}>`
- **Note**: In Bootstrap 5, `<Col>` without props defaults to full width
- **Can simplify to**: Just `<Col>` (xs={12} is redundant)
- **When to keep xs={12}**: Only if you need explicit breakpoint control

### 3. Centered Button Layout
**Pattern**: 
```tsx
<Col xs={10} sm={8} className="d-grid gap-2 mx-auto">
  <Link className="btn btn-primary btn-lg">...</Link>
</Col>
```
- **Used**: ~66 times across the codebase
- **Purpose**: Centers buttons with consistent width (10 cols on mobile, 8 on tablet+)
- **Classes**:
  - `d-grid gap-2`: Makes button full-width with gap
  - `mx-auto`: Centers the column
  - `btn-lg`: Large button size

### 4. Display Headings
**Pattern**: `className="display-1"`, `display-2`, `display-3`, `display-4`
- **Bootstrap utility**: Large, bold headings
- **Usage**: Page titles, section headers
- **Common**: `display-1` for main page title, `display-2` for section headers

### 5. Row Spacing
**Pattern**: `Row className="mb-3"` or `Row className="my-3"`
- **mb-3**: Margin bottom (spacing between sections)
- **my-3**: Margin top and bottom
- **Common**: Used for spacing between content sections

### 6. Icon Links
**Pattern**: `<div className="icon-link">` with Bootstrap Icons
- **Custom class**: Defined in SCSS
- **Usage**: Icons with text, typically in buttons or cards

## Custom CSS Classes

### From SCSS files:
- `.horizontal-card`: Custom card styling with specific padding/sizing
- `.cube-card`: Cube-specific card styling
- `.icon-stack`: Stacked icon layout
- `.icon-link`: Icon with text styling
- `.staff-accordion`: Custom accordion styling for staff views

## Streamlining Opportunities

1. **Remove redundant `xs={12}`**: Can simplify ~118 instances
2. **Button layout component**: Could create a simple component for the repeated button pattern (but keep it simple!)
3. **Loading components**: Some still use Container directly instead of PageContainer


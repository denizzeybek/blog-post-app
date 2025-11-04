# Claude Code Agents

This directory contains project-specific Claude Code agents.

## Available Agents

### 🚀 Fullstack Developer (`fullstack-developer.md`)

**Usage:**
```bash
# Within Claude Code
/task agent:fullstack-developer "Add rating system to blogs"
```

Or using Task tool:
```
Using Task tool:
- subagent_type: "fullstack-developer"
- prompt: "Add rating system to blogs with 1-5 stars"
```

**When to use:**
- Adding new full-stack features
- Modifying both backend and frontend together
- Extending existing features
- Fixing bugs
- Refactoring operations

**Agent capabilities:**
- Vue 3 + TypeScript + PrimeVue (frontend)
- Express.js + MongoDB (backend)
- JWT authentication handling
- AWS S3 integration
- Automatic Context7 usage
- Task tracking with TodoWrite

## Agent Usage Examples

### Example 1: Adding New Feature

```
User: Add a comment system to blog posts with user authentication

Agent will:
1. Create Comment model (backend)
2. Add comment controller and routes
3. Create TypeScript interfaces (frontend)
4. Add Pinia store for comments
5. Build comment UI components
6. Test the entire flow
```

### Example 2: Bug Fix

```
User: Users can't see their profile picture after uploading

Agent will:
1. Check upload flow (backend)
2. Verify S3 integration
3. Check frontend image rendering
4. Fix the issue systematically
5. Test the fix
```

### Example 3: API Changes

```
User: Add pagination to blog list endpoint

Agent will:
1. Update backend controller with skip/limit
2. Modify frontend store to handle pagination
3. Update TypeScript interfaces
4. Add pagination UI components
5. Test with different page sizes
```

## Agent Workflow

1. **Task Planning** - Agent creates TodoList
2. **Context Loading** - Reads relevant files
3. **Implementation** - Writes code systematically
4. **Testing** - Verifies changes work
5. **Documentation** - Updates if needed
6. **Completion** - Marks all todos complete

## Best Practices

### ✅ Do:
- Give clear, specific requirements
- Mention if auth is needed
- Specify frontend + backend if both need changes
- Let agent use Context7 automatically
- Review agent's TodoList before it starts coding

### ❌ Don't:
- Give vague instructions ("make it better")
- Override agent's systematic approach
- Skip testing step
- Forget to specify authentication requirements

## Customizing Agents

To customize the agent prompt:

1. Edit `.claude/agents/fullstack-developer.md` file
2. Add new directives
3. Update examples
4. Restart Claude Code (to load changes)

## Troubleshooting

**Agent not working as expected:**
- Make prompts more specific
- Provide more context to the agent
- Check CLAUDE.md (agent references this file)

**Agent making changes in wrong files:**
- Specify full file paths
- Use "blog-post-client" or "blog-post-server" prefix

**Agent not using Context7:**
- Check directive in CLAUDE.md
- Read Context7 section in agent prompt
- Manually say "Use Context7 for [library]"

## Future Enhancements

**To split into two agents:**
- Create `frontend-developer.md` (Vue/TypeScript only)
- Create `backend-developer.md` (Express/MongoDB only)
- Add orchestrator agent (coordinates both agents)

**When to split:**
- Project reaches 50k+ lines of code
- Frontend and backend become independent
- Different teams need separate agents

---

**Note:** Agents automatically read and reference CLAUDE.md and folder READMEs (blog-post-client/README.md, blog-post-server/README.md).

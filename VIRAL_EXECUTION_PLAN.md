# Homework GOAT - Viral Execution Plan

## Current Status (December 2025)

### Completed
- [x] Core gameplay (5 worlds, quests, bosses, NPCs)
- [x] Mobile touch controls (joystick + action button)
- [x] Mobile-responsive UI across all screens
- [x] Sound effects system
- [x] XP/Level progression system
- [x] World unlock system
- [x] AI testing API (window.gameTestAPI)
- [x] Enchanted Forest quest IDs fixed

### Known Issues
- [ ] Need comprehensive mobile testing
- [ ] AI agent automated testing not fully implemented
- [ ] Some screens may still need mobile optimization

---

## Phase 1: Stability & Polish (Week 1-2)

### 1.1 Automated Testing System
**Goal:** AI agent can play through entire game and find bugs

- [ ] Implement Playwright/Puppeteer test runner
- [ ] Create test scenarios:
  - [ ] New player onboarding flow
  - [ ] Complete all quests in each world
  - [ ] Unlock all worlds progression
  - [ ] Boss battle completion
  - [ ] Chest puzzle solving
  - [ ] Shard collection
- [ ] Add visual regression testing
- [ ] Set up CI/CD pipeline for tests

```javascript
// Example: AI Test Command
window.gameTestAPI.runFullGameTest().then(results => {
  console.log(results);
});
```

### 1.2 Mobile Optimization
- [ ] Test on iOS Safari (known WebGL issues)
- [ ] Test on Android Chrome
- [ ] Fix any remaining scroll/touch issues
- [ ] Optimize 3D rendering for low-end devices
- [ ] Add loading states/spinners

### 1.3 Bug Fixes from Testing
- [ ] Document all bugs found
- [ ] Prioritize P0 (blocking) bugs
- [ ] Fix critical path issues

---

## Phase 2: Viral Features (Week 3-4)

### 2.1 Social Sharing
**Impact: High - Organic user acquisition**

- [ ] **Shareable Achievement Cards**
  - Generate image cards showing:
    - Player avatar
    - Level reached
    - Accuracy percentage
    - "Challenge me!" call-to-action
  - Share to: Twitter, Facebook, Instagram Stories

- [ ] **"Beat My Score" Links**
  - Unique URL per challenge
  - Shows friend's score to beat
  - Tracks referral source

### 2.2 Referral System
**Impact: High - Network effects**

- [ ] **Friend Codes**
  - 6-character codes (e.g., "MATH42")
  - Both referrer and friend get rewards
  - Track referral conversions

- [ ] **Family Accounts**
  - Parent dashboard to track kids
  - Sibling leaderboards
  - Family weekly challenges

### 2.3 Class/Teacher Integration
**Impact: Very High - 30 users per teacher**

- [ ] **Class Codes**
  - Teachers create class
  - Students join with code
  - Class leaderboard
  - Weekly class reports

- [ ] **Teacher Dashboard**
  - See all student progress
  - Identify struggling students
  - Export reports for parents

### 2.4 Weekly Challenges
**Impact: Medium - Retention**

- [ ] Time-limited events
- [ ] Special rewards
- [ ] Leaderboard competition
- [ ] Push notification support

---

## Phase 3: Content & Polish (Week 5-6)

### 3.1 More Content
- [ ] Add 2 more worlds
- [ ] Daily challenges
- [ ] Achievement badges
- [ ] Cosmetic unlocks

### 3.2 Parent Features
- [ ] Progress reports (email/SMS)
- [ ] Screen time controls
- [ ] Difficulty settings per child
- [ ] "Math improved by X%" metrics

### 3.3 Accessibility
- [ ] Color blind mode
- [ ] Font size options
- [ ] Audio descriptions
- [ ] Reduced motion option

---

## Phase 4: Launch & Marketing (Week 7-8)

### 4.1 Pre-Launch
- [ ] Landing page with email capture
- [ ] Press kit
- [ ] Influencer outreach list
- [ ] App store assets (if going native)

### 4.2 Influencer Marketing
**Target: Micro-influencers (10k-100k followers)**

| Platform | Target Influencers | Content Type |
|----------|-------------------|--------------|
| TikTok | Homeschool moms, teachers | "Watch my kid play" |
| Instagram | Education accounts | Stories, Reels |
| YouTube | EdTech reviewers | Full reviews |
| Pinterest | Homeschool boards | Infographics |

### 4.3 Launch Strategy
1. Soft launch to 100 beta families
2. Gather feedback & fix issues
3. Public launch with PR push
4. TikTok campaign ($500-1000 budget)
5. Teacher Facebook groups outreach

### 4.4 Metrics to Track
- DAU/MAU ratio (target: >20%)
- D1/D7/D30 retention
- Viral coefficient (K-factor)
- Questions answered per session
- Accuracy improvement over time

---

## Technical Architecture for Viral Features

### Database Schema Additions
```sql
-- Referrals
referrals (
  id, referrer_id, referred_id, code,
  status, created_at, converted_at
)

-- Classes
classes (
  id, teacher_id, name, code,
  created_at, student_count
)

-- Class Members
class_members (
  class_id, student_id, joined_at
)

-- Challenges
challenges (
  id, type, start_date, end_date,
  rewards, requirements
)

-- Challenge Progress
challenge_progress (
  challenge_id, user_id, progress,
  completed_at
)
```

### API Endpoints Needed
```
POST /api/referrals/create
POST /api/referrals/redeem
GET  /api/referrals/stats

POST /api/classes/create
POST /api/classes/join
GET  /api/classes/:id/leaderboard
GET  /api/classes/:id/report

GET  /api/challenges/active
POST /api/challenges/:id/progress
GET  /api/challenges/:id/leaderboard

GET  /api/share/achievement-card/:userId
GET  /api/share/challenge/:challengeId
```

---

## Budget Estimate

| Item | Cost | Notes |
|------|------|-------|
| Firebase (backend) | $0-50/mo | Free tier covers early growth |
| Vercel (hosting) | $0-20/mo | Free tier for now |
| Micro-influencers | $500-2000 | 10-20 influencers @ $50-100 each |
| TikTok ads (test) | $500-1000 | Initial test campaigns |
| Design assets | $200-500 | App store, social media |
| **Total Launch** | **$1,200-3,500** | |

---

## Success Metrics

### Week 1 Goals
- [ ] 100 beta users
- [ ] <5 critical bugs
- [ ] 70%+ D1 retention

### Month 1 Goals
- [ ] 1,000 active users
- [ ] 5+ teacher signups
- [ ] K-factor > 1.0 (viral!)

### Month 3 Goals
- [ ] 10,000 active users
- [ ] 50+ classes using it
- [ ] Featured in 1+ education blog

---

## June's Journey Lessons Applied

1. **No Lose Condition** - Already implemented! Wrong answers = learning, not failure
2. **Target Demographic** - Parents of kids 6-12, teachers
3. **Weekly Content** - Plan for weekly challenges
4. **Community Building** - Class codes, family accounts
5. **Localization** - Plan for Spanish, French (later)

---

## Next Immediate Actions

1. **TODAY**: Run full test suite, document any bugs
2. **THIS WEEK**: Implement shareable achievement cards
3. **NEXT WEEK**: Build referral code system
4. **WEEK 3**: Teacher dashboard MVP

---

*Last Updated: December 2025*

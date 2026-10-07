import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    PRIMARY = RGBColor(234, 88, 12)       # FoodHub Warm Orange / Sunset
    PRIMARY_DARK = RGBColor(194, 65, 12)
    NAVY = RGBColor(15, 23, 42)           # Slate 900
    NAVY_LIGHT = RGBColor(30, 41, 59)     # Slate 800
    ACCENT_GREEN = RGBColor(16, 185, 129) # Emerald 500
    ACCENT_BLUE = RGBColor(14, 165, 233)  # Sky 500
    ACCENT_PURPLE = RGBColor(139, 92, 246)
    BG_LIGHT = RGBColor(248, 250, 252)    # Slate 50
    CARD_BG = RGBColor(255, 255, 255)     # White
    CARD_BORDER = RGBColor(226, 232, 240) # Slate 200
    TEXT_DARK = RGBColor(15, 23, 42)
    TEXT_MUTED = RGBColor(100, 116, 139)  # Slate 500
    TEXT_LIGHT = RGBColor(248, 250, 252)

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, title_text, category_text="FOODHUB MERN SYSTEM"):
        # Category pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(3.2), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = RGBColor(254, 242, 242)
        pill.line.color.rgb = RGBColor(254, 202, 202)
        tf_pill = pill.text_frame
        tf_pill.word_wrap = True
        p_pill = tf_pill.paragraphs[0]
        p_pill.text = category_text.upper()
        p_pill.font.size = Pt(10)
        p_pill.font.bold = True
        p_pill.font.color.rgb = PRIMARY
        p_pill.alignment = PP_ALIGN.CENTER

        # Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.88), Inches(11.5), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = NAVY

    def create_card(slide, left, top, width, height, title, items, badge="", badge_color=PRIMARY, icon_char=""):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.2)

        # Header bar inside card
        header_box = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.6))
        tf_h = header_box.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = f"{icon_char} {title}".strip()
        p_h.font.size = Pt(16)
        p_h.font.bold = True
        p_h.font.color.rgb = NAVY

        if badge:
            badge_shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + width - Inches(1.8), top + Inches(0.18), Inches(1.6), Inches(0.3))
            badge_shape.fill.solid()
            badge_shape.fill.fore_color.rgb = badge_color
            badge_shape.line.fill.background()
            p_b = badge_shape.text_frame.paragraphs[0]
            p_b.text = badge
            p_b.font.size = Pt(9)
            p_b.font.bold = True
            p_b.font.color.rgb = RGBColor(255, 255, 255)
            p_b.alignment = PP_ALIGN.CENTER

        # Body items
        body_box = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.75), width - Inches(0.5), height - Inches(0.85))
        tf_b = body_box.text_frame
        tf_b.word_wrap = True
        
        for i, item in enumerate(items):
            p = tf_b.paragraphs[0] if i == 0 else tf_b.add_paragraph()
            p.space_after = Pt(8)
            p.space_before = Pt(2)
            
            if isinstance(item, tuple):
                lead, text = item
                r_lead = p.add_run()
                r_lead.text = f"• {lead}: "
                r_lead.font.bold = True
                r_lead.font.size = Pt(12)
                r_lead.font.color.rgb = NAVY
                
                r_text = p.add_run()
                r_text.text = text
                r_text.font.size = Pt(12)
                r_text.font.color.rgb = TEXT_DARK
            else:
                r = p.add_run()
                r.text = f"• {item}"
                r.font.size = Pt(12)
                r.font.color.rgb = TEXT_DARK

    # ==========================================
    # SLIDE 1: Title & Introduction (Cover)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, NAVY)

    # Decorative background card
    dec = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.4), Inches(7.5))
    dec.fill.solid()
    dec.fill.fore_color.rgb = PRIMARY
    dec.line.fill.background()

    # Pill badge
    s1_pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(4.2), Inches(0.45))
    s1_pill.fill.solid()
    s1_pill.fill.fore_color.rgb = NAVY_LIGHT
    s1_pill.line.color.rgb = PRIMARY
    s1_pill.line.width = Pt(1)
    p_s1p = s1_pill.text_frame.paragraphs[0]
    p_s1p.text = "FULL-STACK MERN ARCHITECTURE • ACADEMIC & INDUSTRY PROJECT"
    p_s1p.font.size = Pt(10)
    p_s1p.font.bold = True
    p_s1p.font.color.rgb = PRIMARY
    p_s1p.alignment = PP_ALIGN.CENTER

    # Main Title
    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(10.8), Inches(2.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "FoodHub: Food Order Management System"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_LIGHT

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Real-Time Digital Restaurant Ordering, Kitchen Fulfillment & Business Intelligence System"
    p1_sub.font.size = Pt(18)
    p1_sub.font.color.rgb = RGBColor(203, 213, 225)
    p1_sub.space_before = Pt(12)

    # Overview Card on Slide 1
    s1_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.4), Inches(10.8), Inches(2.3))
    s1_card.fill.solid()
    s1_card.fill.fore_color.rgb = NAVY_LIGHT
    s1_card.line.color.rgb = RGBColor(51, 65, 85)
    tf_s1c = s1_card.text_frame
    tf_s1c.word_wrap = True

    p_intro_h = tf_s1c.paragraphs[0]
    p_intro_h.text = "Executive Summary & System Introduction"
    p_intro_h.font.bold = True
    p_intro_h.font.size = Pt(15)
    p_intro_h.font.color.rgb = PRIMARY

    p_intro_b = tf_s1c.add_paragraph()
    p_intro_b.text = "FoodHub is an end-to-end web-based culinary management platform engineered using the modern MERN stack (MongoDB, Express.js, React 19, and Node.js). It seamlessly connects food patrons seeking intuitive dish discovery with restaurant administrators managing real-time kitchen queues, dynamic menus, and daily revenue statistics."
    p_intro_b.font.size = Pt(12)
    p_intro_b.font.color.rgb = RGBColor(226, 232, 240)
    p_intro_b.space_before = Pt(6)

    p_intro_f = tf_s1c.add_paragraph()
    p_intro_f.text = "Key Highlights: Zero-refresh Single Page Architecture • Role-Based JWT Security • Live Order Tracking Timeline • Cloud/Local Multi-Tenant Ready"
    p_intro_f.font.size = Pt(11)
    p_intro_f.font.bold = True
    p_intro_f.font.color.rgb = ACCENT_GREEN
    p_intro_f.space_before = Pt(8)


    # ==========================================
    # SLIDE 2: Problem Statement and Objectives
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, BG_LIGHT)
    add_header(s2, "Problem Statement & Project Objectives", "02 • MOTIVATION & GOALS")

    create_card(
        s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1),
        "Problem Statement",
        [
            ("Operational Inefficiencies", "Traditional pen-and-paper ordering creates kitchen bottlenecks, misplaced order slips, and billing miscalculations."),
            ("Aggregator Dominance", "Commercial aggregator monopolies charge exorbitant 20%-35% platform fees per order, eating restaurant margins."),
            ("Information Asymmetry", "Customers lack transparency into food preparation stages, leading to customer dissatisfaction and inquiry delays."),
            ("Static Menu Management", "Inability to dynamically mark sold-out items results in cancelled orders and wasted kitchen ingredients."),
            ("Data Isolation", "Standalone restaurants lose direct customer ownership, sales analytics, and localized operational intelligence.")
        ],
        badge="CURRENT CHALLENGES",
        badge_color=PRIMARY_DARK,
        icon_char="⚠️"
    )

    create_card(
        s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1),
        "Project Objectives",
        [
            ("Automated Digital Ordering", "Develop an intuitive, ultra-responsive customer portal for catalog search, filtering, and instant checkout."),
            ("Dual-Role Access Control", "Implement granular role-based authentication (Admin vs. Customer) secured via JWT tokens and bcrypt hashing."),
            ("End-to-End Order Lifecycle", "Deliver dynamic order stage progression (Placed -> Preparing -> Out for Delivery -> Delivered) with live timestamps."),
            ("Real-Time Kitchen Console", "Provide an administrative dashboard with one-click status transitions and live menu availability toggling."),
            ("Actionable Revenue Insights", "Equip owners with live KPI analytics: total gross revenue, order volume, and pending delivery workloads.")
        ],
        badge="CORE GOALS",
        badge_color=ACCENT_GREEN,
        icon_char="🎯"
    )


    # ==========================================
    # SLIDE 3: Scope & Relevance to SDGs
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, BG_LIGHT)
    add_header(s3, "Project Scope & Relevance to UN SDGs", "03 • SCOPE & SUSTAINABILITY")

    create_card(
        s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1),
        "Project Scope & Demarcation",
        [
            ("Customer Portal (In-Scope)", "Browse categorized menus, search dishes, real-time cart computation with tax/discounts, order placement & tracking."),
            ("Admin/Kitchen Suite (In-Scope)", "Order queue orchestration, status dispatching, catalog stock control, sales dashboard."),
            ("Security & Core (In-Scope)", "Protected REST API routes, cryptographic password hashing, token verification middleware, seed data generator."),
            ("Target Segments", "Independent restaurants, cloud kitchens, campus cafeterias, hotel room service, and quick-service diners."),
            ("Future Scope Extensions", "Online Payment Gateway webhook (Stripe/Razorpay), GPS courier tracking, and AI-driven personalized recommendations.")
        ],
        badge="SYSTEM BOUNDARIES",
        badge_color=ACCENT_BLUE,
        icon_char="🔭"
    )

    create_card(
        s3, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1),
        "Alignment with UN Sustainable Development Goals",
        [
            ("SDG 8: Decent Work & Economic Growth", "Empowers local food enterprises by eliminating hefty aggregator commissions, boosting SME profitability, and providing digital workplace management tools."),
            ("SDG 12: Responsible Consumption & Production", "Real-time menu availability toggles prevent kitchen ingredient over-prep and spoilage; 100% digital invoices eliminate paper receipts and physical ticket waste."),
            ("SDG 9: Industry, Innovation & Infrastructure", "Demonstrates modern, resilient digital micro-infrastructure leveraging decoupled REST APIs and scalable non-relational data modeling."),
            ("SDG 11: Sustainable Communities", "Fosters decentralized hyper-local food networks by connecting neighborhood kitchens directly with local patrons.")
        ],
        badge="UNITED NATIONS SDGS",
        badge_color=ACCENT_PURPLE,
        icon_char="🌍"
    )


    # ==========================================
    # SLIDE 4: Study of Existing Solutions
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, BG_LIGHT)
    add_header(s4, "Study of Existing Solutions & Literature Review", "04 • RESEARCH & COMPARISON")

    create_card(
        s4, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.1),
        "Academic Research Paper 1",
        [
            ("Publication", "IEEE / IJERT (Noor et al.)"),
            ("Study Title", "\"Design & Implementation of Web-Based Food Ordering Systems\""),
            ("Findings", "Examined classical web apps built with monolithic SQL architectures. Encountered significant database locking during peak rush hours and rigid tabular menu schemas."),
            ("FoodHub Advantage", "Leverages MongoDB's flexible schema-less JSON document model, enabling sub-millisecond food catalog queries and dynamic dietary tags.")
        ],
        badge="LITERATURE REVIEW",
        badge_color=NAVY_LIGHT,
        icon_char="📄"
    )

    create_card(
        s4, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.1),
        "Academic Research Paper 2",
        [
            ("Publication", "IJACSA / Springer (Patel & Shah)"),
            ("Study Title", "\"Real-Time Kitchen Coordination & Order Tracking System\""),
            ("Findings", "Analyzed status communication latencies between dining waitstaff and chefs. Concluded that manual communication caused 38% of order preparation delays."),
            ("FoodHub Advantage", "Introduces dedicated dual-portal status state machine: admin status toggle instantly updates customer timeline without telephone or paper friction.")
        ],
        badge="LITERATURE REVIEW",
        badge_color=NAVY_LIGHT,
        icon_char="📄"
    )

    create_card(
        s4, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.1),
        "Commercial Aggregators",
        [
            ("Market Solutions", "Zomato, Swiggy, UberEats"),
            ("Limitations", "Charge 20% to 35% commission on gross sales. Aggregators mask customer contact data, preventing restaurants from establishing direct loyalty programs."),
            ("Vendor Lock-in", "Third-party platform algorithms penalize independent kitchens."),
            ("FoodHub Advantage", "Zero commission overhead, full customer ownership, autonomous branding, self-hosted deployment on premises or cloud.")
        ],
        badge="INDUSTRY BENCHMARK",
        badge_color=PRIMARY,
        icon_char="⚡"
    )


    # ==========================================
    # SLIDE 5: Proposed Solution & Workflow Diagram
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, BG_LIGHT)
    add_header(s5, "Proposed Solution & System Architecture Workflow", "05 • SYSTEM DESIGN & WORKFLOW")

    # Workflow step boxes
    steps = [
        ("Step 1", "Customer Discovery", "Browse categorized menu, search items, filter veg/spicy", PRIMARY),
        ("Step 2", "Interactive Cart", "Manage item quantities, instant tax/delivery calculations", ACCENT_BLUE),
        ("Step 3", "Secure Checkout", "JWT authentication, delivery address & payment capture", ACCENT_PURPLE),
        ("Step 4", "Kitchen Dispatch", "Admin dashboard receives order; updates status to 'Preparing'", PRIMARY_DARK),
        ("Step 5", "Live Tracking", "Customer views updated timeline: 'Out for Delivery' -> 'Delivered'", ACCENT_GREEN),
    ]

    for idx, (step_num, title, desc, col) in enumerate(steps):
        s_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + idx * 2.4), Inches(1.8), Inches(2.2), Inches(2.1))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = CARD_BG
        s_box.line.color.rgb = col
        s_box.line.width = Pt(1.5)

        tf_s = s_box.text_frame
        tf_s.word_wrap = True

        p_num = tf_s.paragraphs[0]
        p_num.text = step_num.upper()
        p_num.font.size = Pt(9)
        p_num.font.bold = True
        p_num.font.color.rgb = col

        p_t = tf_s.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY
        p_t.space_before = Pt(3)

        p_d = tf_s.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_DARK
        p_d.space_before = Pt(4)

    # Architectural Layer Card (Bottom)
    arch_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.2), Inches(11.7), Inches(2.7))
    arch_card.fill.solid()
    arch_card.fill.fore_color.rgb = CARD_BG
    arch_card.line.color.rgb = CARD_BORDER
    tf_arch = arch_card.text_frame
    tf_arch.word_wrap = True

    p_a_h = tf_arch.paragraphs[0]
    p_a_h.text = "🏛️ Multi-Tier Architecture & Data Flow Overview"
    p_a_h.font.bold = True
    p_a_h.font.size = Pt(15)
    p_a_h.font.color.rgb = NAVY

    layers = [
        ("Client Tier (Presentation)", "React 19 Single Page Application • Vite HMR • Lucide Icons • React Context State (Auth, Cart, Toast)"),
        ("API Gateway Tier (Controller)", "Node.js & Express.js REST API • CORS Handlers • JWT Verification Guard • JSON Parsing Middleware"),
        ("Business Service Tier (Logic)", "Order State Engine • Auth & Bcrypt Hashing Service • Menu Catalog Queries • Real-time Stats Aggregator"),
        ("Database Tier (Persistence)", "MongoDB Document Store • Mongoose Schemas (User, FoodItem, Category, Order) • Automated Seeding Engine")
    ]

    for title, desc in layers:
        p = tf_arch.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = f"• {title}: "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = PRIMARY
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(11)
        r2.font.color.rgb = TEXT_DARK


    # ==========================================
    # SLIDE 6: Modules Identified
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, BG_LIGHT)
    add_header(s6, "Modules Identified & Functional Breakdown", "06 • SYSTEM MODULES")

    mods = [
        ("Module 1: Authentication & RBAC", "Bcrypt password hashing (10 rounds), signed JSON Web Tokens (JWT), automatic token persistence in client localStorage, role verification (Customer vs. Admin).", PRIMARY),
        ("Module 2: Menu & Catalog Management", "Dynamic multi-category filtering, full-text dish search, vegetarian/non-veg tags, spice meter ratings, and instant food stock toggling.", ACCENT_BLUE),
        ("Module 3: Cart & Dynamic Checkout", "Client-side cart drawer, real-time quantity increments/decrements, subtotal computation, coupon discounts, GST calculation, delivery instructions.", ACCENT_PURPLE),
        ("Module 4: Order Lifecycle State Machine", "Status transitions: Placed -> Preparing -> Out for Delivery -> Delivered. Chronological audit history with timestamped timeline entries.", PRIMARY_DARK),
        ("Module 5: Admin Kitchen Control Suite", "Master control room: Live revenue KPI metrics, active order queue counter, order status dispatch action buttons, and direct inventory controls.", ACCENT_GREEN)
    ]

    for i, (title, desc, col) in enumerate(mods):
        top_y = Inches(1.8 + i * 1.02)
        m_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_y, Inches(11.7), Inches(0.92))
        m_card.fill.solid()
        m_card.fill.fore_color.rgb = CARD_BG
        m_card.line.color.rgb = CARD_BORDER
        m_card.line.width = Pt(1)

        # color stripe
        strp = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), top_y + Inches(0.12), Inches(0.15), Inches(0.68))
        strp.fill.solid()
        strp.fill.fore_color.rgb = col
        strp.line.fill.background()

        tf_m = m_card.text_frame
        tf_m.word_wrap = True

        p_mh = tf_m.paragraphs[0]
        p_mh.text = f"   {title}"
        p_mh.font.bold = True
        p_mh.font.size = Pt(13)
        p_mh.font.color.rgb = NAVY

        p_mb = tf_m.add_paragraph()
        p_mb.text = f"   {desc}"
        p_mb.font.size = Pt(11)
        p_mb.font.color.rgb = TEXT_DARK
        p_mb.space_before = Pt(2)


    # ==========================================
    # SLIDE 7: Technologies & Resources Required
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, BG_LIGHT)
    add_header(s7, "Technologies, Tools & Hardware Resources", "07 • TECH STACK & REQUIREMENTS")

    create_card(
        s7, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.1),
        "Frontend Technology",
        [
            ("Framework", "React 19 (Modern Hooks, Component Architecture, Fast SPA rendering)"),
            ("Build Tool", "Vite 6 (Instant Hot Module Replacement & production bundle)"),
            ("Styling System", "Vanilla CSS3 (Responsive grid, curated color palette, glassmorphism)"),
            ("State Management", "React Context API (Auth, Cart, Toast notifications)"),
            ("Iconography", "Lucide React (Vector icons)")
        ],
        badge="PRESENTATION TIER",
        badge_color=ACCENT_BLUE,
        icon_char="💻"
    )

    create_card(
        s7, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.1),
        "Backend & Database",
        [
            ("Runtime", "Node.js v20+ LTS"),
            ("Web Framework", "Express.js v4.21 (Modular router, JSON middleware)"),
            ("Database", "MongoDB v8.x (High throughput document database)"),
            ("ODM", "Mongoose v8.9 (Strict schema validations, index indexing)"),
            ("Security", "JSONWebToken (JWT) & BcryptJS (Password salt/hash)")
        ],
        badge="APPLICATION & DATA TIER",
        badge_color=PRIMARY,
        icon_char="⚙️"
    )

    create_card(
        s7, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.1),
        "Tools & Resources",
        [
            ("Version Control", "Git & GitHub Remote Repository"),
            ("Execution Scripts", "PowerShell & Windows Batch (start.bat, end.bat, push_to_github.bat)"),
            ("Hardware Specs", "Standard workstation: Dual-Core CPU, 4GB+ RAM, 5GB disk space"),
            ("API Testing", "PowerShell automated integration testing suite (test_api.ps1)")
        ],
        badge="INFRASTRUCTURE",
        badge_color=ACCENT_GREEN,
        icon_char="🛠️"
    )


    # ==========================================
    # SLIDE 8: Expected Outcomes and Tentative Timeline
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, BG_LIGHT)
    add_header(s8, "Expected Outcomes & Tentative Timeline", "08 • DELIVERABLES & ROADMAP")

    create_card(
        s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1),
        "Expected Project Outcomes",
        [
            ("Production-Ready MERN Portal", "Flawlessly functioning online ordering web application deployed with sub-second API latency."),
            ("Empowered Kitchen Staff", "Elimination of misplaced order tickets via real-time status dispatch buttons."),
            ("Zero Financial Aggregator Leakage", "100% direct revenue retention for the food establishment."),
            ("Eco-Friendly Paperless Billing", "Full digital invoice audit trail supporting SDG 12 sustainability guidelines."),
            ("Verified Reliability", "Comprehensive automated integration test suite validating end-to-end customer and admin journeys with 100% pass rate.")
        ],
        badge="PROJECT DELIVERABLES",
        badge_color=ACCENT_GREEN,
        icon_char="🏆"
    )

    create_card(
        s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.1),
        "Tentative 10-Week Gantt Timeline",
        [
            ("Week 1 - 2: Foundation", "Requirements gathering, architectural definition, Mongoose schema modeling & DB setup."),
            ("Week 3 - 4: Backend REST APIs", "Implementation of Express route controllers, JWT authentication, and automated data seeders."),
            ("Week 5 - 6: Frontend Development", "Responsive UI implementation (catalog, cart drawer, food detail modal, toast alerts)."),
            ("Week 7 - 8: Integration & Admin Suite", "Admin dashboard, order state machine, timeline tracking, and live stock toggles."),
            ("Week 9: Testing & Optimization", "Unit & API integration testing (test_api.ps1), security audit, performance tuning."),
            ("Week 10: Deployment & Handover", "GitHub version control setup, documentation, user manuals, and presentation.")
        ],
        badge="ROADMAP",
        badge_color=PRIMARY,
        icon_char="📅"
    )

    output_path = "Food_Order_Management_System_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_deck()

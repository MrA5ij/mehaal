"""Seed initial data for production"""
from sqlalchemy.orm import Session
from datetime import datetime
from app.models import SiteSettings, LoginPage, SignupPage, LegalDocument
from app.database.database import SessionLocal

def seed_initial_data():
    """Add default records for production"""
    db: Session = SessionLocal()
    
    try:
        # Check if data already exists
        existing_settings = db.query(SiteSettings).first()
        if existing_settings:
            print("✅ Data already seeded")
            return
        
        # 1. Site Settings
        settings = SiteSettings(
            site_name="Mehaal",
            primary_color="#6366F1",
            support_email="support@mehaal.com",
            footer_links=[
                {"label": "About", "url": "/about"},
                {"label": "Blog", "url": "/blog"},
                {"label": "Contact", "url": "/contact"},
            ],
            social_links={
                "twitter": "https://twitter.com/mehaal",
                "linkedin": "https://linkedin.com/company/mehaal",
                "github": "https://github.com/mehaal",
            },
            default_seo_title="Mehaal - Your CMS",
            default_seo_description="A powerful and flexible CMS platform"
        )
        db.add(settings)
        
        # 2. Login Page
        login_page = LoginPage(
            heading="Welcome Back",
            subheading="Sign in to your account",
            show_social_login=True,
            seo_title="Login - Mehaal",
            seo_description="Sign in to your Mehaal account"
        )
        db.add(login_page)
        
        # 3. Signup Page
        signup_page = SignupPage(
            heading="Create Your Account",
            subheading="Join thousands of happy users",
            show_social_signup=True,
            terms_required=True,
            signup_fields=[
                {"name": "email", "type": "email", "required": True},
                {"name": "password", "type": "password", "required": True},
                {"name": "company", "type": "text", "required": False},
            ],
            seo_title="Sign Up - Mehaal",
            seo_description="Create a new Mehaal account"
        )
        db.add(signup_page)
        
        # 4. Privacy Policy
        privacy_doc = LegalDocument(
            type="privacy",
            title="Privacy Policy",
            slug="privacy-policy",
            content="""
            # Privacy Policy
            
            Last updated: {date}
            
            ## Introduction
            Welcome to Mehaal. We respect your privacy...
            
            ## Information We Collect
            - Account information
            - Usage data
            - Device information
            
            ## How We Use Information
            - Service improvement
            - Communication
            - Security
            
            ## Data Protection
            We implement industry-standard security measures...
            """.format(date=datetime.now().strftime("%B %d, %Y")),
            version=1,
            effective_date=datetime.now(),
            is_active=True
        )
        db.add(privacy_doc)
        
        # 5. Terms of Service
        tos_doc = LegalDocument(
            type="tos",
            title="Terms of Service",
            slug="terms-of-service",
            content="""
            # Terms of Service
            
            Last updated: {date}
            
            ## Agreement to Terms
            By accessing and using this website, you accept and agree to be bound...
            
            ## Use License
            Permission is granted to temporarily download materials for personal use...
            
            ## Limitations
            In no event shall Mehaal or its suppliers be liable...
            
            ## Disclaimer
            The materials on Mehaal's website are provided as is...
            """.format(date=datetime.now().strftime("%B %d, %Y")),
            version=1,
            effective_date=datetime.now(),
            is_active=True
        )
        db.add(tos_doc)
        
        db.commit()
        print("✅ Initial data seeded successfully")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_initial_data()

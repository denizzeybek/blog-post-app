// migrations/seed-blog-data.js
// Blog konulu örnek data migration

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Blog = require('../models/blog.model');
const User = require('../models/user.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Seed Categories
const categories = [
  {
    categoryName: 'Web Geliştirme',
    enCategoryName: 'Web Development',
    categoryDetails: 'Modern web teknolojileri, framework\'ler ve en iyi pratikler hakkında kapsamlı içerikler',
    enCategoryDetails: 'Comprehensive content about modern web technologies, frameworks and best practices',
    iconName: 'pi pi-code',
  },
  {
    categoryName: 'Tasarım',
    enCategoryName: 'Design',
    categoryDetails: 'UI/UX tasarımı, kullanıcı deneyimi ve görsel tasarım prensipleri',
    enCategoryDetails: 'UI/UX design, user experience and visual design principles',
    iconName: 'pi pi-palette',
  },
  {
    categoryName: 'Dijital Pazarlama',
    enCategoryName: 'Digital Marketing',
    categoryDetails: 'SEO, içerik pazarlama, sosyal medya stratejileri ve dijital reklamcılık',
    enCategoryDetails: 'SEO, content marketing, social media strategies and digital advertising',
    iconName: 'pi pi-chart-line',
  },
  {
    categoryName: 'İş & Girişimcilik',
    enCategoryName: 'Business & Entrepreneurship',
    categoryDetails: 'Startup kültürü, iş geliştirme ve girişimcilik deneyimleri',
    enCategoryDetails: 'Startup culture, business development and entrepreneurship experiences',
    iconName: 'pi pi-briefcase',
  },
  {
    categoryName: 'Teknoloji Haberleri',
    enCategoryName: 'Technology News',
    categoryDetails: 'Son teknoloji trendleri, ürün incelemeleri ve sektör haberleri',
    enCategoryDetails: 'Latest technology trends, product reviews and industry news',
    iconName: 'pi pi-mobile',
  },
];

// Seed Blogs (5 blogs per category)
const blogTemplates = {
  'Web Geliştirme': [
    {
      name: 'Vue 3 Composition API ile Modern Web Uygulamaları',
      enName: 'Modern Web Applications with Vue 3 Composition API',
      documentUrl: 'https://example.com/blog/vue3-composition-api-tr',
      enDocumentUrl: 'https://example.com/blog/vue3-composition-api-en',
    },
    {
      name: 'TypeScript ile Tip Güvenli JavaScript Geliştirme',
      enName: 'Type-Safe JavaScript Development with TypeScript',
      documentUrl: 'https://example.com/blog/typescript-guide-tr',
      enDocumentUrl: 'https://example.com/blog/typescript-guide-en',
    },
    {
      name: 'REST API Tasarımında En İyi Uygulamalar',
      enName: 'Best Practices in REST API Design',
      documentUrl: 'https://example.com/blog/rest-api-best-practices-tr',
      enDocumentUrl: 'https://example.com/blog/rest-api-best-practices-en',
    },
    {
      name: 'MongoDB ile NoSQL Veritabanı Yönetimi',
      enName: 'NoSQL Database Management with MongoDB',
      documentUrl: 'https://example.com/blog/mongodb-guide-tr',
      enDocumentUrl: 'https://example.com/blog/mongodb-guide-en',
    },
    {
      name: 'Express.js ile Ölçeklenebilir Backend Mimarisi',
      enName: 'Scalable Backend Architecture with Express.js',
      documentUrl: 'https://example.com/blog/expressjs-architecture-tr',
      enDocumentUrl: 'https://example.com/blog/expressjs-architecture-en',
    },
  ],
  'Tasarım': [
    {
      name: 'Kullanıcı Deneyimi Tasarımında 5 Altın Kural',
      enName: '5 Golden Rules in User Experience Design',
      documentUrl: 'https://example.com/blog/ux-golden-rules-tr',
      enDocumentUrl: 'https://example.com/blog/ux-golden-rules-en',
    },
    {
      name: 'Minimalist Tasarım Felsefesi ve Uygulaması',
      enName: 'Minimalist Design Philosophy and Practice',
      documentUrl: 'https://example.com/blog/minimalist-design-tr',
      enDocumentUrl: 'https://example.com/blog/minimalist-design-en',
    },
    {
      name: 'Renk Teorisi ve Web Tasarımında Kullanımı',
      enName: 'Color Theory and Its Use in Web Design',
      documentUrl: 'https://example.com/blog/color-theory-web-tr',
      enDocumentUrl: 'https://example.com/blog/color-theory-web-en',
    },
    {
      name: 'Figma ile Prototip Geliştirme Rehberi',
      enName: 'Prototyping Guide with Figma',
      documentUrl: 'https://example.com/blog/figma-prototyping-tr',
      enDocumentUrl: 'https://example.com/blog/figma-prototyping-en',
    },
    {
      name: 'Responsive Tasarım: Mobile-First Yaklaşımı',
      enName: 'Responsive Design: Mobile-First Approach',
      documentUrl: 'https://example.com/blog/mobile-first-design-tr',
      enDocumentUrl: 'https://example.com/blog/mobile-first-design-en',
    },
  ],
  'Dijital Pazarlama': [
    {
      name: 'SEO Stratejileri: 2024 Güncel Rehber',
      enName: 'SEO Strategies: 2024 Updated Guide',
      documentUrl: 'https://example.com/blog/seo-strategies-2024-tr',
      enDocumentUrl: 'https://example.com/blog/seo-strategies-2024-en',
    },
    {
      name: 'İçerik Pazarlama ile Marka Bilinirliği Artırma',
      enName: 'Increasing Brand Awareness with Content Marketing',
      documentUrl: 'https://example.com/blog/content-marketing-brand-tr',
      enDocumentUrl: 'https://example.com/blog/content-marketing-brand-en',
    },
    {
      name: 'Sosyal Medya Analitikleri ve Metrikler',
      enName: 'Social Media Analytics and Metrics',
      documentUrl: 'https://example.com/blog/social-media-analytics-tr',
      enDocumentUrl: 'https://example.com/blog/social-media-analytics-en',
    },
    {
      name: 'E-posta Pazarlama Kampanyaları Optimizasyonu',
      enName: 'Email Marketing Campaign Optimization',
      documentUrl: 'https://example.com/blog/email-marketing-optimization-tr',
      enDocumentUrl: 'https://example.com/blog/email-marketing-optimization-en',
    },
    {
      name: 'Google Ads ile Etkili Reklam Yönetimi',
      enName: 'Effective Ad Management with Google Ads',
      documentUrl: 'https://example.com/blog/google-ads-management-tr',
      enDocumentUrl: 'https://example.com/blog/google-ads-management-en',
    },
  ],
  'İş & Girişimcilik': [
    {
      name: 'Startup Kurmak: İlk Adımlar Rehberi',
      enName: 'Starting a Startup: First Steps Guide',
      documentUrl: 'https://example.com/blog/startup-first-steps-tr',
      enDocumentUrl: 'https://example.com/blog/startup-first-steps-en',
    },
    {
      name: 'Yatırımcı Sunumu Hazırlama Teknikleri',
      enName: 'Investor Pitch Preparation Techniques',
      documentUrl: 'https://example.com/blog/investor-pitch-tr',
      enDocumentUrl: 'https://example.com/blog/investor-pitch-en',
    },
    {
      name: 'Uzaktan Çalışma Kültürü ve Verimlilik',
      enName: 'Remote Work Culture and Productivity',
      documentUrl: 'https://example.com/blog/remote-work-culture-tr',
      enDocumentUrl: 'https://example.com/blog/remote-work-culture-en',
    },
    {
      name: 'Dijital Dönüşüm ve İş Modelleri',
      enName: 'Digital Transformation and Business Models',
      documentUrl: 'https://example.com/blog/digital-transformation-tr',
      enDocumentUrl: 'https://example.com/blog/digital-transformation-en',
    },
    {
      name: 'Proje Yönetimi: Agile vs Scrum',
      enName: 'Project Management: Agile vs Scrum',
      documentUrl: 'https://example.com/blog/agile-vs-scrum-tr',
      enDocumentUrl: 'https://example.com/blog/agile-vs-scrum-en',
    },
  ],
  'Teknoloji Haberleri': [
    {
      name: 'Yapay Zeka: 2024\'te Beklenen Gelişmeler',
      enName: 'Artificial Intelligence: Expected Developments in 2024',
      documentUrl: 'https://example.com/blog/ai-developments-2024-tr',
      enDocumentUrl: 'https://example.com/blog/ai-developments-2024-en',
    },
    {
      name: 'Web 3.0 ve Blockchain Teknolojileri',
      enName: 'Web 3.0 and Blockchain Technologies',
      documentUrl: 'https://example.com/blog/web3-blockchain-tr',
      enDocumentUrl: 'https://example.com/blog/web3-blockchain-en',
    },
    {
      name: '5G Teknolojisi ve Mobil İletişimin Geleceği',
      enName: '5G Technology and the Future of Mobile Communication',
      documentUrl: 'https://example.com/blog/5g-technology-tr',
      enDocumentUrl: 'https://example.com/blog/5g-technology-en',
    },
    {
      name: 'Siber Güvenlik: Güncel Tehditler ve Çözümler',
      enName: 'Cybersecurity: Current Threats and Solutions',
      documentUrl: 'https://example.com/blog/cybersecurity-threats-tr',
      enDocumentUrl: 'https://example.com/blog/cybersecurity-threats-en',
    },
    {
      name: 'Nesnelerin İnterneti (IoT) ve Akıllı Ev Sistemleri',
      enName: 'Internet of Things (IoT) and Smart Home Systems',
      documentUrl: 'https://example.com/blog/iot-smart-home-tr',
      enDocumentUrl: 'https://example.com/blog/iot-smart-home-en',
    },
  ],
};

// Seed additional users
const additionalUsers = [
  { email: 'editor@blog.com', password: 'editor123' },
  { email: 'author1@blog.com', password: 'author123' },
  { email: 'author2@blog.com', password: 'author123' },
  { email: 'reviewer@blog.com', password: 'reviewer123' },
];

async function seedDatabase() {
  try {
    await connectDB();

    console.log('\n🌱 Starting database seeding...\n');

    // Clear existing data (except users - admin'i silmemek için)
    console.log('📝 Clearing existing blogs and categories...');
    await Blog.deleteMany({});
    await Category.deleteMany({});
    console.log('✓ Existing data cleared\n');

    // Seed additional users
    console.log('👥 Creating additional users...');
    const existingUsers = await User.find({});
    console.log(`   Found ${existingUsers.length} existing user(s)`);

    for (const userData of additionalUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`   ✓ Created user: ${userData.email}`);
      } else {
        console.log(`   → User already exists: ${userData.email}`);
      }
    }

    const totalUsers = await User.countDocuments();
    console.log(`   Total users in database: ${totalUsers}\n`);

    // Seed categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✓ Created ${createdCategories.length} categories\n`);

    // Seed blogs
    console.log('📝 Creating blogs...');
    let totalBlogs = 0;

    for (const category of createdCategories) {
      const categoryBlogs = blogTemplates[category.categoryName];

      if (categoryBlogs) {
        const blogsWithCategory = categoryBlogs.map(blog => ({
          ...blog,
          category: category._id,
        }));

        await Blog.insertMany(blogsWithCategory);
        console.log(`   ✓ Created ${blogsWithCategory.length} blogs for "${category.categoryName}"`);
        totalBlogs += blogsWithCategory.length;
      }
    }

    console.log(`✓ Created ${totalBlogs} blogs in total\n`);

    // Summary
    console.log('📊 Database Seeding Summary:');
    console.log('   ─────────────────────────────');
    console.log(`   Users:      ${await User.countDocuments()}`);
    console.log(`   Categories: ${await Category.countDocuments()}`);
    console.log(`   Blogs:      ${await Blog.countDocuments()}`);
    console.log('   ─────────────────────────────');
    console.log('\n✨ Database seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();

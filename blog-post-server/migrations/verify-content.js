// Quick script to verify blog content fields
require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/blog.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected\n');
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

async function verifyContent() {
  try {
    await connectDB();

    console.log('🔍 Checking blog content fields...\n');

    // Find first blog with content
    const blogWithContent = await Blog.findOne({
      name: 'Vue 3 Composition API ile Modern Web Uygulamaları'
    });

    if (blogWithContent) {
      console.log('Blog Name:', blogWithContent.name);
      console.log('Has Turkish content:', !!blogWithContent.content);
      console.log('Has English content:', !!blogWithContent.enContent);

      if (blogWithContent.content) {
        console.log('\nTurkish content preview (first 200 chars):');
        console.log(blogWithContent.content.substring(0, 200) + '...');
      }

      if (blogWithContent.enContent) {
        console.log('\nEnglish content preview (first 200 chars):');
        console.log(blogWithContent.enContent.substring(0, 200) + '...');
      }
    }

    // Count blogs with content
    const totalBlogs = await Blog.countDocuments();
    const blogsWithContent = await Blog.countDocuments({ content: { $ne: '' } });
    const blogsWithEnContent = await Blog.countDocuments({ enContent: { $ne: '' } });

    console.log('\n📊 Statistics:');
    console.log(`   Total blogs: ${totalBlogs}`);
    console.log(`   Blogs with Turkish content: ${blogsWithContent}`);
    console.log(`   Blogs with English content: ${blogsWithEnContent}`);

    console.log('\n✨ Verification complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

verifyContent();

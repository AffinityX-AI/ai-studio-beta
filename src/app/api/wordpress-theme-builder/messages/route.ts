// import Anthropic from '@anthropic-ai/sdk'

import { sql } from '@/utils/wordpress-theme-builder-db'

export const revalidate = 0

export async function GET(request: Request) {
  const params = await request.json()
  const themeId = parseInt(params.id)
  const messages = await sql`
    SELECT * FROM chat_messages WHERE theme_id = ${themeId} AND public = true ORDER BY created_at ASC
  `

  return Response.json({
    messages: messages.map((message: any) => ({
      id: message.id,
      sender: message.sender,
      message: message.message,
      created_at: message.created_at,
    })),
  })
}

// export async function POST() {
//   // const threads = await sql`
//   //   SELECT * FROM threads ORDER BY id DESC
//   // `

//   // return Response.json({
//   //   threads: threads.map((thread: any) => ({
//   //     id: thread.id,
//   //     name: thread.name,
//   //     website: thread.website,
//   //     address: thread.address,
//   //     execution: thread.execution,
//   //     status: thread.status,
//   //     progress: thread.progress,
//   //     running_steps: thread.running_steps,
//   //     completed_steps: thread.completed_steps,
//   //     report: thread.report,
//   //     updated_at: thread.updated_at,
//   //   })),
//   // })

//   const anthropic = new Anthropic({
//     apiKey: process.env['ANTHROPIC_API_KEY'],
//   })

//   const msg = await anthropic.messages.create({
//     model: 'claude-3-opus-20240229',
//     max_tokens: 4000,
//     temperature: 0,
//     system:
//       'You are a Wordpress template builder. Your task is to design and build a 1-page landing template for a SMB.',
//     messages: [
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Build a wordpress template for a coffee shop using gutenberg blocks and a stylesheet with a generated color palette. The color palette should be modern and go well with the coffee shop theme.',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "Here's a Wordpress template for a coffee shop using Gutenberg blocks and a generated color palette:\n\nStylesheet (style.css):\n```css\n/*\nTheme Name: Coffee Shop\nAuthor: Your Name\nDescription: A modern and inviting theme for a coffee shop.\nVersion: 1.0\n*/\n\n/* Color Palette */\n:root {\n  --primary-color: #4F2C1D;\n  --secondary-color: #A67B5B;\n  --accent-color: #F3DEBA;\n  --text-color: #333333;\n  --background-color: #F9F6F1;\n}\n\n/* Global Styles */\nbody {\n  font-family: 'Montserrat', sans-serif;\n  color: var(--text-color);\n  background-color: var(--background-color);\n}\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: 'Playfair Display', serif;\n  color: var(--primary-color);\n}\n\na {\n  color: var(--secondary-color);\n  text-decoration: none;\n}\n\na:hover {\n  color: var(--primary-color);\n}\n\n/* Header */\n.site-header {\n  background-color: var(--accent-color);\n  padding: 20px;\n}\n\n.site-title {\n  font-size: 36px;\n  margin: 0;\n}\n\n/* Navigation */\n.main-navigation {\n  margin-top: 20px;\n}\n\n.main-navigation ul {\n  list-style: none;\n  padding: 0;\n}\n\n.main-navigation li {\n  display: inline-block;\n  margin-right: 20px;\n}\n\n/* Hero Section */\n.hero-section {\n  background-image: url('path/to/coffee-shop-image.jpg');\n  background-size: cover;\n  background-position: center;\n  padding: 100px 0;\n  text-align: center;\n  color: #FFFFFF;\n}\n\n.hero-section h2 {\n  font-size: 48px;\n  margin-bottom: 20px;\n}\n\n.hero-section p {\n  font-size: 24px;\n  margin-bottom: 40px;\n}\n\n.button {\n  display: inline-block;\n  padding: 10px 20px;\n  background-color: var(--secondary-color);\n  color: #FFFFFF;\n  font-size: 18px;\n  border-radius: 4px;\n}\n\n.button:hover {\n  background-color: var(--primary-color);\n}\n\n/* Featured Products */\n.featured-products {\n  padding: 80px 0;\n  text-align: center;\n}\n\n.featured-products h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.product {\n  display: inline-block;\n  width: 300px;\n  margin: 20px;\n  text-align: left;\n}\n\n.product img {\n  width: 100%;\n  height: auto;\n  margin-bottom: 10px;\n}\n\n.product h3 {\n  font-size: 24px;\n  margin-bottom: 10px;\n}\n\n.product p {\n  font-size: 16px;\n  color: var(--text-color);\n}\n\n/* About Section */\n.about-section {\n  padding: 80px 0;\n  background-color: var(--accent-color);\n  text-align: center;\n}\n\n.about-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.about-section p {\n  font-size: 18px;\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n/* Footer */\n.site-footer {\n  background-color: var(--primary-color);\n  color: #FFFFFF;\n  padding: 20px;\n  text-align: center;\n}\n```\n\nTemplate Structure (",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Continue',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "index.php):\n```php\n<?php\n/**\n * Template Name: Coffee Shop Landing Page\n */\n\nget_header();\n?>\n\n<!-- Hero Section -->\n<section class=\"hero-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Welcome to Our Coffee Shop', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('Discover the rich flavors and inviting atmosphere of our cozy coffee shop.', 'coffee-shop'); ?></p>\n    <a href=\"#\" class=\"button\"><?php echo esc_html__('View Menu', 'coffee-shop'); ?></a>\n  </div>\n</section>\n\n<!-- Featured Products -->\n<section class=\"featured-products\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Featured Products', 'coffee-shop'); ?></h2>\n    <div class=\"wp-block-columns\">\n      <div class=\"wp-block-column product\">\n        <img src=\"<?php echo esc_url(get_template_directory_uri() . '/images/product1.jpg'); ?>\" alt=\"Product 1\">\n        <h3><?php echo esc_html__('Espresso', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Rich and bold espresso shot.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"<?php echo esc_url(get_template_directory_uri() . '/images/product2.jpg'); ?>\" alt=\"Product 2\">\n        <h3><?php echo esc_html__('Cappuccino', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Creamy and frothy cappuccino.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"<?php echo esc_url(get_template_directory_uri() . '/images/product3.jpg'); ?>\" alt=\"Product 3\">\n        <h3><?php echo esc_html__('Latte', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Smooth and silky latte.', 'coffee-shop'); ?></p>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- About Section -->\n<section class=\"about-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('About Us', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('We are passionate about serving the finest coffee and creating a warm and welcoming environment for our customers. Visit us and experience the difference.', 'coffee-shop'); ?></p>\n  </div>\n</section>\n\n<?php get_footer(); ?>\n```\n\nThis template uses Gutenberg blocks to create a visually appealing and modern layout for a coffee shop landing page. The color palette is generated to complement the coffee shop theme, with warm and inviting colors.\n\nThe template includes a hero section with a background image, a featured products section showcasing three products, and an about section providing information about the coffee shop.\n\nMake sure to replace the placeholder text and images with your own content and adjust the styles in the stylesheet to match your desired design.\n\nRemember to create the necessary template files (`header.php`, `footer.php`) and enqueue the stylesheet in your theme's `functions.php` file to ensure the template works correctly.",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Add in some sample generated content and placeholder images',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "Certainly! Here's the updated template with sample generated content and placeholder images:\n\nStylesheet (style.css):\n```css\n/* ... (previous styles remain the same) ... */\n```\n\nTemplate Structure (index.php):\n```php\n<?php\n/**\n * Template Name: Coffee Shop Landing Page\n */\n\nget_header();\n?>\n\n<!-- Hero Section -->\n<section class=\"hero-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Welcome to The Cozy Bean', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('Discover the rich flavors and inviting atmosphere of our cozy coffee shop.', 'coffee-shop'); ?></p>\n    <a href=\"#\" class=\"button\"><?php echo esc_html__('View Menu', 'coffee-shop'); ?></a>\n  </div>\n</section>\n\n<!-- Featured Products -->\n<section class=\"featured-products\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Featured Products', 'coffee-shop'); ?></h2>\n    <div class=\"wp-block-columns\">\n      <div class=\"wp-block-column product\">\n        <img src=\"<?php echo esc_url(get_template_directory_uri() . '/images/espresso.jpg'); ?>\" alt=\"Espresso\">\n        <h3><?php echo esc_html__('Espresso', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Indulge in our rich and bold espresso, carefully crafted to perfection.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"<?php echo esc_url(get_template_directory_uri() . '/images/cappuccino.jpg'); ?>\" alt=\"Cappuccino\">\n        <h3><?php echo esc_html__('Cappuccino', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Experience the perfect balance of creamy milk and robust espresso in our velvety cappuccino.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"<?php echo esc_url(get_template_directory_uri() . '/images/latte.jpg'); ?>\" alt=\"Latte\">\n        <h3><?php echo esc_html__('Latte', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Savor the smooth and silky texture of our latte, topped with beautiful latte art.', 'coffee-shop'); ?></p>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- About Section -->\n<section class=\"about-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('About The Cozy Bean', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('At The Cozy Bean, we are passionate about serving the finest coffee and creating a warm and welcoming environment for our customers. Our skilled baristas handcraft each cup with precision and care, using only the highest quality beans sourced from around the world. Whether you\\'re looking for a quick caffeine fix or a place to relax and unwind, The Cozy Bean is your go-to destination. Visit us and experience the difference in every sip.', 'coffee-shop'); ?></p>\n  </div>\n</section>\n\n<?php get_footer(); ?>\n```\n\nPlaceholder Images:\n- `espresso.jpg`: A close-up shot of a rich and creamy espresso.\n- `cappuccino.jpg`: An inviting image of a frothy cappuccino with a dusting of cocoa powder.\n- `latte.jpg`: A beautiful latte with intricate latte art on top.\n\nMake sure to place these placeholder images in the `/images` directory of your theme.\n\nThe sample generated content includes:\n- A welcoming headline and",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Use placeholder images from royalty-free stock photo sites',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "Certainly! Here's the updated template with placeholder images from royalty-free stock photo sites:\n\nStylesheet (style.css):\n```css\n/* ... (previous styles remain the same) ... */\n```\n\nTemplate Structure (index.php):\n```php\n<?php\n/**\n * Template Name: Coffee Shop Landing Page\n */\n\nget_header();\n?>\n\n<!-- Hero Section -->\n<section class=\"hero-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Welcome to The Cozy Bean', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('Discover the rich flavors and inviting atmosphere of our cozy coffee shop.', 'coffee-shop'); ?></p>\n    <a href=\"#\" class=\"button\"><?php echo esc_html__('View Menu', 'coffee-shop'); ?></a>\n  </div>\n</section>\n\n<!-- Featured Products -->\n<section class=\"featured-products\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Featured Products', 'coffee-shop'); ?></h2>\n    <div class=\"wp-block-columns\">\n      <div class=\"wp-block-column product\">\n        <img src=\"https://cdn.pixabay.com/photo/2016/04/12/11/19/coffee-1324126_960_720.jpg\" alt=\"Espresso\">\n        <h3><?php echo esc_html__('Espresso', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Indulge in our rich and bold espresso, carefully crafted to perfection.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"https://cdn.pixabay.com/photo/2017/03/27/13/54/coffee-2178032_960_720.jpg\" alt=\"Cappuccino\">\n        <h3><?php echo esc_html__('Cappuccino', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Experience the perfect balance of creamy milk and robust espresso in our velvety cappuccino.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"https://cdn.pixabay.com/photo/2016/11/29/12/52/coffee-1869647_960_720.jpg\" alt=\"Latte\">\n        <h3><?php echo esc_html__('Latte', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Savor the smooth and silky texture of our latte, topped with beautiful latte art.', 'coffee-shop'); ?></p>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- About Section -->\n<section class=\"about-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('About The Cozy Bean', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('At The Cozy Bean, we are passionate about serving the finest coffee and creating a warm and welcoming environment for our customers. Our skilled baristas handcraft each cup with precision and care, using only the highest quality beans sourced from around the world. Whether you\\'re looking for a quick caffeine fix or a place to relax and unwind, The Cozy Bean is your go-to destination. Visit us and experience the difference in every sip.', 'coffee-shop'); ?></p>\n  </div>\n</section>\n\n<?php get_footer(); ?>\n```\n\nPlaceholder Images:\n- Espresso: [https://cdn.pixabay.com/photo/2016/04/12/11/19/coffee-1324126_960_720.jpg](https://cdn.pixabay.com/photo/2016/04/12/11/19/coffee-1324126_960_720.jpg)",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Add in additional gutenberg blocks for Our Location, Reviews, and a Blog Preview',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: 'Certainly! Here\'s the updated template with additional Gutenberg blocks for Our Location, Reviews, and a Blog Preview:\n\nStylesheet (style.css):\n```css\n/* ... (previous styles remain the same) ... */\n\n/* Location Section */\n.location-section {\n  padding: 80px 0;\n  text-align: center;\n}\n\n.location-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.location-map {\n  margin-top: 40px;\n}\n\n/* Reviews Section */\n.reviews-section {\n  padding: 80px 0;\n  background-color: var(--accent-color);\n  text-align: center;\n}\n\n.reviews-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.review {\n  max-width: 600px;\n  margin: 0 auto 40px;\n}\n\n.review p {\n  font-size: 18px;\n  margin-bottom: 20px;\n}\n\n.review .reviewer {\n  font-weight: bold;\n}\n\n/* Blog Preview Section */\n.blog-preview-section {\n  padding: 80px 0;\n  text-align: center;\n}\n\n.blog-preview-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.blog-post {\n  display: inline-block;\n  width: 300px;\n  margin: 20px;\n  text-align: left;\n}\n\n.blog-post img {\n  width: 100%;\n  height: auto;\n  margin-bottom: 10px;\n}\n\n.blog-post h3 {\n  font-size: 24px;\n  margin-bottom: 10px;\n}\n\n.blog-post p {\n  font-size: 16px;\n  color: var(--text-color);\n}\n\n.read-more {\n  display: inline-block;\n  margin-top: 20px;\n  padding: 10px 20px;\n  background-color: var(--secondary-color);\n  color: #FFFFFF;\n  font-size: 16px;\n  border-radius: 4px;\n}\n\n.read-more:hover {\n  background-color: var(--primary-color);\n}\n```\n\nTemplate Structure (index.php):\n```php\n<?php\n/**\n * Template Name: Coffee Shop Landing Page\n */\n\nget_header();\n?>\n\n<!-- ... (previous sections remain the same) ... -->\n\n<!-- Location Section -->\n<section class="location-section">\n  <div class="wp-block-group">\n    <h2><?php echo esc_html__(\'Our Location\', \'coffee-shop\'); ?></h2>\n    <p><?php echo esc_html__(\'Visit us at our cozy coffee shop located in the heart of the city.\', \'coffee-shop\'); ?></p>\n    <div class="location-map">\n      <!-- Embed Google Map or add an image of the location -->\n      <img src="https://cdn.pixabay.com/photo/2017/04/19/20/10/coffee-shop-2242213_960_720.jpg" alt="Coffee Shop Location">\n    </div>\n  </div>\n</section>\n\n<!-- Reviews Section -->\n<section class="reviews-section">\n  <div class="wp-block-group">\n    <h2><?php echo esc_html__(\'What Our Customers Say\', \'coffee-shop\'); ?></h2>\n    <div class="wp-block-columns">\n      <div class="wp-block-column review">\n        <p><?php echo esc_html__(\'"The Cozy Bean is my go-to spot for a delicious cup of coffee and a cozy atmosphere. Highly recommended!"\', \'coffee-shop\'); ?></p>\n        <p class="reviewer"><?php echo esc_html__(\'- John Doe\', \'coffee-shop\'); ?></p>\n      </div>\n      <div class="wp-block-column review">\n        <p><?php echo esc',
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Continue',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "_html__('\"I love the friendly staff and the amazing latte art at The Cozy Bean. It\\'s the perfect place to relax and unwind.\"', 'coffee-shop'); ?></p>\n        <p class=\"reviewer\"><?php echo esc_html__('- Jane Smith', 'coffee-shop'); ?></p>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- Blog Preview Section -->\n<section class=\"blog-preview-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Latest Blog Posts', 'coffee-shop'); ?></h2>\n    <div class=\"wp-block-columns\">\n      <div class=\"wp-block-column blog-post\">\n        <img src=\"https://cdn.pixabay.com/photo/2015/10/12/14/54/coffee-983955_960_720.jpg\" alt=\"Blog Post 1\">\n        <h3><?php echo esc_html__('The Art of Coffee Roasting', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Discover the secrets behind our expertly roasted coffee beans and how they contribute to the perfect cup.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column blog-post\">\n        <img src=\"https://cdn.pixabay.com/photo/2016/03/27/21/21/coffee-1284041_960_720.jpg\" alt=\"Blog Post 2\">\n        <h3><?php echo esc_html__('The Benefits of Coffee', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Explore the surprising health benefits of drinking coffee and how it can boost your productivity and well-being.', 'coffee-shop'); ?></p>\n      </div>\n    </div>\n    <a href=\"#\" class=\"read-more\"><?php echo esc_html__('Read More Articles', 'coffee-shop'); ?></a>\n  </div>\n</section>\n\n<?php get_footer(); ?>\n```\n\nPlaceholder Images:\n- Coffee Shop Location: [https://cdn.pixabay.com/photo/2017/04/19/20/10/coffee-shop-2242213_960_720.jpg](https://cdn.pixabay.com/photo/2017/04/19/20/10/coffee-shop-2242213_960_720.jpg)\n- Blog Post 1: [https://cdn.pixabay.com/photo/2015/10/12/14/54/coffee-983955_960_720.jpg](https://cdn.pixabay.com/photo/2015/10/12/14/54/coffee-983955_960_720.jpg)\n- Blog Post 2: [https://cdn.pixabay.com/photo/2016/03/27/21/21/coffee-1284041_960_720.jpg](https://cdn.pixabay.com/photo/2016/03/27/21/21/coffee-1284041_960_720.jpg)\n\nThe template now includes additional sections:\n\n1. Our Location: Displays information about the coffee shop's location along with an embedded map or an image of the location.\n\n2. Reviews: Showcases customer reviews and testimonials to build trust and credibility.\n\n3. Blog Preview: Provides a preview of the latest blog posts to engage visitors and encourage them to explore more content.\n\nMake sure to replace the placeholder content and images with your own relevant information and images.\n\nThe styles for these new sections have been added to the stylesheet, maintaining consistency with the overall design of the template.\n\nRemember to create the necessary template files (`header.php`, `footer.php`) and enqueue the stylesheet in your theme's `functions.php` file to ensure the template works correctly.",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Return the full index.php file',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "Certainly! Here's the full `index.php` file with all the sections included:\n\n```php\n<?php\n/**\n * Template Name: Coffee Shop Landing Page\n */\n\nget_header();\n?>\n\n<!-- Hero Section -->\n<section class=\"hero-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Welcome to The Cozy Bean', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('Discover the rich flavors and inviting atmosphere of our cozy coffee shop.', 'coffee-shop'); ?></p>\n    <a href=\"#\" class=\"button\"><?php echo esc_html__('View Menu', 'coffee-shop'); ?></a>\n  </div>\n</section>\n\n<!-- Featured Products -->\n<section class=\"featured-products\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Featured Products', 'coffee-shop'); ?></h2>\n    <div class=\"wp-block-columns\">\n      <div class=\"wp-block-column product\">\n        <img src=\"https://cdn.pixabay.com/photo/2016/04/12/11/19/coffee-1324126_960_720.jpg\" alt=\"Espresso\">\n        <h3><?php echo esc_html__('Espresso', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Indulge in our rich and bold espresso, carefully crafted to perfection.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"https://cdn.pixabay.com/photo/2017/03/27/13/54/coffee-2178032_960_720.jpg\" alt=\"Cappuccino\">\n        <h3><?php echo esc_html__('Cappuccino', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Experience the perfect balance of creamy milk and robust espresso in our velvety cappuccino.', 'coffee-shop'); ?></p>\n      </div>\n      <div class=\"wp-block-column product\">\n        <img src=\"https://cdn.pixabay.com/photo/2016/11/29/12/52/coffee-1869647_960_720.jpg\" alt=\"Latte\">\n        <h3><?php echo esc_html__('Latte', 'coffee-shop'); ?></h3>\n        <p><?php echo esc_html__('Savor the smooth and silky texture of our latte, topped with beautiful latte art.', 'coffee-shop'); ?></p>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- About Section -->\n<section class=\"about-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('About The Cozy Bean', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('At The Cozy Bean, we are passionate about serving the finest coffee and creating a warm and welcoming environment for our customers. Our skilled baristas handcraft each cup with precision and care, using only the highest quality beans sourced from around the world. Whether you\\'re looking for a quick caffeine fix or a place to relax and unwind, The Cozy Bean is your go-to destination. Visit us and experience the difference in every sip.', 'coffee-shop'); ?></p>\n  </div>\n</section>\n\n<!-- Location Section -->\n<section class=\"location-section\">\n  <div class=\"wp-block-group\">\n    <h2><?php echo esc_html__('Our Location', 'coffee-shop'); ?></h2>\n    <p><?php echo esc_html__('Visit us at our cozy coffee shop located in the heart of the city.', 'coffee-shop'); ?></p>\n    <div class=\"location-map\">\n      <!-- Embed Google Map or add an image of the location -->\n      <img src=\"https",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Fix the link hover styling, fix the white text on a light background in the hero section, and make the page full-width fluid. Use a royalty-free stock photo for the hero background.',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "Certainly! Here's the updated `style.css` file with the requested changes:\n\n```css\n/*\nTheme Name: Coffee Shop\nAuthor: Your Name\nDescription: A modern and inviting theme for a coffee shop.\nVersion: 1.0\n*/\n\n/* Color Palette */\n:root {\n  --primary-color: #4F2C1D;\n  --secondary-color: #A67B5B;\n  --accent-color: #F3DEBA;\n  --text-color: #333333;\n  --background-color: #F9F6F1;\n  --light-text-color: #FFFFFF;\n}\n\n/* Global Styles */\nbody {\n  font-family: 'Montserrat', sans-serif;\n  color: var(--text-color);\n  background-color: var(--background-color);\n  margin: 0;\n  padding: 0;\n}\n\n.container {\n  max-width: 100%;\n  padding: 0 20px;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: 'Playfair Display', serif;\n  color: var(--primary-color);\n}\n\na {\n  color: var(--secondary-color);\n  text-decoration: none;\n}\n\na:hover {\n  color: var(--primary-color);\n  text-decoration: underline;\n}\n\n/* Header */\n.site-header {\n  background-color: var(--accent-color);\n  padding: 20px;\n}\n\n.site-title {\n  font-size: 36px;\n  margin: 0;\n}\n\n/* Navigation */\n.main-navigation {\n  margin-top: 20px;\n}\n\n.main-navigation ul {\n  list-style: none;\n  padding: 0;\n}\n\n.main-navigation li {\n  display: inline-block;\n  margin-right: 20px;\n}\n\n/* Hero Section */\n.hero-section {\n  background-image: url('https://cdn.pixabay.com/photo/2015/10/12/14/54/coffee-983955_960_720.jpg');\n  background-size: cover;\n  background-position: center;\n  padding: 100px 0;\n  text-align: center;\n  color: var(--light-text-color);\n}\n\n.hero-section h2 {\n  font-size: 48px;\n  margin-bottom: 20px;\n  color: var(--light-text-color);\n}\n\n.hero-section p {\n  font-size: 24px;\n  margin-bottom: 40px;\n  color: var(--light-text-color);\n}\n\n.button {\n  display: inline-block;\n  padding: 10px 20px;\n  background-color: var(--secondary-color);\n  color: var(--light-text-color);\n  font-size: 18px;\n  border-radius: 4px;\n}\n\n.button:hover {\n  background-color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* Featured Products */\n.featured-products {\n  padding: 80px 0;\n  text-align: center;\n}\n\n.featured-products h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.product {\n  display: inline-block;\n  width: 300px;\n  margin: 20px;\n  text-align: left;\n}\n\n.product img {\n  width: 100%;\n  height: auto;\n  margin-bottom: 10px;\n}\n\n.product h3 {\n  font-size: 24px;\n  margin-bottom: 10px;\n}\n\n.product p {\n  font-size: 16px;\n  color: var(--text-color);\n}\n\n/* About Section */\n.about-section {\n  padding: 80px 0;\n  background-color: var(--accent-color);\n  text-align: center;\n}\n\n.about-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.about-section p {\n  font-size: 18px;\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n/* Location Section */\n.location-section {\n  padding: 80px 0;\n  text-align: center;\n}\n\n.location-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.location-map {\n  margin-top: 40px;\n}\n\n/* Reviews Section */\n.reviews-section {\n  padding: 80px 0;\n  background-color: var(--accent-color);\n  text-align: center;\n}\n\n.reviews-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.review {\n  max-width: 600px;\n  margin: 0 auto 40px;\n}\n\n.review p {\n  font-size: 18px;\n  margin-bottom: 20px;\n}\n\n.review .reviewer {\n  font-weight: bold;\n}\n\n/* Blog Preview Section */\n.blog-preview-section {\n  padding: 80px 0;\n  text-align: center;\n}\n\n.blog-preview-section h2 {\n  font-size: 36px;\n  margin-bottom: 40px;\n}\n\n.blog-post {\n  display: inline-block;\n  width: 300px;\n  margin: 20px;\n  text-align: left;\n}\n\n.blog-post img {\n  width: 100%;\n  height: auto;\n  margin-bottom: 10px;\n}\n\n.blog-post h3 {\n  font-size: 24px;\n  margin-bottom: 10px;\n}\n\n.blog-post p {\n  font-size: 16px;\n  color: var(--text-color);\n}\n\n.read-more {\n  display: inline-block;\n  margin-top: 20px;\n  padding: 10px 20px;\n  background-color: var(--secondary-color);\n  color: var(--light-text-color);\n  font-size: 16px;\n  border-radius: 4px;\n}\n\n.read-more:hover {\n  background-color: var(--primary-color);\n  text-decoration: none;\n}\n\n/* Footer */\n.site-footer {\n  background-color: var(--primary-color);\n  color: var(--light-text-color);\n  padding: 20px;\n  text-align: center;\n}\n```\n\nHere are the changes made:\n\n1. Fixed the link hover styling:\n   - Added `text-decoration: underline;` to the `a:hover` selector to add an underline on hover.\n   - Removed `text-decoration: none;` fr",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'The image "https://cdn.pixabay.com/photo/2015/10/12/14/54/coffee-983955_960_720.jpg" does not exist, use a different one',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "Apologies for the confusion. Let's use a different royalty-free stock photo for the hero background. Here's an alternative image:\n\n```css\n/* Hero Section */\n.hero-section {\n  background-image: url('https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_960_720.jpg');\n  background-size: cover;\n  background-position: center;\n  padding: 100px 0;\n  text-align: center;\n  color: var(--light-text-color);\n}\n```\n\nThe new image URL is: `https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_960_720.jpg`\n\nThis image features a cozy coffee shop interior with warm lighting and a inviting atmosphere, which should work well as the hero background for your coffee shop landing page.\n\nPlease make sure to replace the image URL in the `style.css` file with the new one provided above.\n\nLet me know if you have any further questions or if there's anything else I can assist you with!",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: '"https://cdn.pixabay.com/photo/2017/03/27/13/54/coffee-2178032_960_720.jpg" also doesn\'t exist, replace it',
//           },
//         ],
//       },
//       {
//         role: 'assistant',
//         content: [
//           {
//             type: 'text',
//             text: "I apologize for the inconvenience. Let's replace the non-existent image with another suitable royalty-free stock photo. Here's an alternative image for the cappuccino product:\n\n```css\n<div class=\"wp-block-column product\">\n  <img src=\"https://cdn.pixabay.com/photo/2016/11/19/12/54/coffee-1839134_960_720.jpg\" alt=\"Cappuccino\">\n  <h3><?php echo esc_html__('Cappuccino', 'coffee-shop'); ?></h3>\n  <p><?php echo esc_html__('Experience the perfect balance of creamy milk and robust espresso in our velvety cappuccino.', 'coffee-shop'); ?></p>\n</div>\n```\n\nThe new image URL is: `https://cdn.pixabay.com/photo/2016/11/19/12/54/coffee-1839134_960_720.jpg`\n\nThis image showcases a delightful cappuccino with a beautiful latte art design on top, which should effectively represent your cappuccino product.\n\nPlease make sure to update the image URL in the `index.php` file with the new one provided above.\n\nIf there are any other images that need replacement or if you have any further questions, please let me know. I'm here to help!",
//           },
//         ],
//       },
//       {
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: 'Generate a header for the theme, where we can include a logo and links to social media profiles',
//           },
//         ],
//       },
//     ],
//   })
//   console.log(msg)
// }

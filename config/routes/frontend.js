module.exports.frontend = {

  'GET /': { action: 'frontend/home/index', locals: { layout: 'frontend/layouts/layout' } },
  
  'GET /user/login': { action: 'frontend/user/view-login', locals: { layout: 'frontend/layouts/layout-guest' } },
  'GET /user/news': { action: 'frontend/news/index', locals: { layout: 'frontend/layouts/layout' } },
  'GET /user/news/:alias/:id': { action: 'frontend/news/detail' , locals: { layout: 'frontend/layouts/layout' }},
  
  'GET /user/profile': { action: 'frontend/user/profile' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /notice': { action: 'frontend/notice/index' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /teacher': { action: 'frontend/teacher/index', locals: { layout: 'frontend/layouts/layout' }},
  'GET /menu': { action: 'frontend/menu/index' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /subject': { action: 'frontend/subject/index' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /news': { action: 'frontend/news/index' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /gallery': { action: 'frontend/gallery/index' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /gallery/:alias/:id': { action: 'frontend/gallery/detail', locals: { layout: 'frontend/layouts/layout' } },
  'GET /about-us': { action: 'frontend/aboutUs/index' , locals: { layout: 'frontend/layouts/layout' }},
  'GET /contact': { action: 'frontend/contact/index', locals: { layout: 'frontend/layouts/layout' } },
  
  'POST /api/v1/frontend/contact/sendMessage': { action: 'frontend/contact/send-contact-message' },
}

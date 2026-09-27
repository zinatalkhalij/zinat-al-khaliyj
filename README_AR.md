# زينة الخليج — نسخة قابلة للنشر

هذه النسخة مهيأة للنشر وليست مجرد نموذج محلي.

## المكونات
- تطبيق Android/iOS باستخدام Expo React Native.
- API باستخدام Node.js + Express.
- قاعدة بيانات PostgreSQL دائمة للحجوزات.
- إعداد Render لنشر الـ API وقاعدة البيانات.
- إعداد EAS لبناء APK للتجربة وAAB للنشر في Google Play.

## 1) نشر الـ API على Render
ارفعي المشروع إلى GitHub.
في Render اختاري Blueprint ثم اختاري مستودع GitHub الذي يحتوي على `render.yaml`.
سيتم إنشاء:
- Web Service للـ API
- PostgreSQL Database

بعد اكتمال النشر ستحصلين على رابط مثل:
https://zinat-al-khalij-api.onrender.com

اختبري:
https://YOUR-API-URL.onrender.com/health

يجب أن يرجع:
{"ok":true}

## 2) ربط التطبيق بالـ API
داخل مجلد frontend أنشئي ملف `.env` واكتبي:
EXPO_PUBLIC_API_BASE_URL=https://YOUR-API-URL.onrender.com

## 3) تجربة التطبيق
داخل frontend:
npm install
npx expo start

## 4) بناء APK للتجربة
ثبتي EAS وسجلي دخولك:
npx eas login

ثم:
npx eas build -p android --profile preview

سينتج APK قابل للتثبيت على أجهزة Android.

## 5) بناء نسخة Google Play
شغلي:
npx eas build -p android --profile production

سينتج ملف AAB مناسب للرفع إلى Google Play Console.

## مهم
النشر الفعلي في Google Play يحتاج حساب Google Play Developer.
النشر على App Store يحتاج Apple Developer Account.

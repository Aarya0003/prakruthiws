# 🚀 Deploy to Render.com - Step by Step Guide

Your code is now on GitHub: **https://github.com/Aarya0003/prakruthiws.git**

Follow these simple steps to deploy your website to Render.com (FREE):

---

## ✅ Step 1: Create Render Account (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with:
   - GitHub account (RECOMMENDED - easiest)
   - OR Email

---

## ✅ Step 2: Create New Web Service (3 minutes)

1. After login, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub"** if prompted
4. Find and select your repository: **prakruthiws**
5. Click **"Connect"**

---

## ✅ Step 3: Configure Deployment Settings

Fill in the following details:

### Basic Settings:
- **Name:** `prakruthi-driving-school` (or any name you want)
- **Region:** Choose closest to India (e.g., Singapore)
- **Branch:** `main`
- **Root Directory:** (leave blank)

### Build Settings:
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Instance Type:
- Select **"Free"** (this gives you free hosting!)

---

## ✅ Step 4: Set Environment Variables

Scroll down to **"Environment Variables"** section and add these:

Click **"Add Environment Variable"** and add:

**Variable 1:**
- Key: `ADMIN_USERNAME`
- Value: `admin`

**Variable 2:**
- Key: `ADMIN_PASSWORD`
- Value: `prakruthi2024` (or change to your preferred password)

**Variable 3:**
- Key: `PORT`
- Value: `3000`

---

## ✅ Step 5: Deploy!

1. Click **"Create Web Service"** button at the bottom
2. Wait 3-5 minutes while Render deploys your site
3. You'll see deployment logs - wait for "Live" status

---

## 🎉 Your Website is Live!

Once deployed, you'll get a URL like:
```
https://prakruthi-driving-school.onrender.com
```

### Test Your Live Website:

1. **Main Website:** `https://your-app-name.onrender.com`
2. **Admin Panel:** `https://your-app-name.onrender.com/admin.html`
   - Username: `admin`
   - Password: `prakruthi2024`

---

## 🔄 Future Updates

Whenever you make changes:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your update message"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Render auto-deploys!** (usually takes 2-3 minutes)

---

## 📱 Custom Domain (Optional)

Want to use your own domain like `www.prakruthidrivingschool.com`?

1. Go to your Render dashboard
2. Click your web service
3. Go to **"Settings"** → **"Custom Domains"**
4. Add your domain and follow DNS instructions

---

## ⚠️ Important Notes:

### Free Plan Limitations:
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Perfect for small business websites
- ⚠️ Server sleeps after 15 minutes of inactivity (wakes up in ~30 seconds when someone visits)
- ⚠️ 750 hours/month free (enough for most small businesses)

### Database:
- SQLite database is stored on disk
- Data persists between deployments
- For production, consider upgrading or using external database

---

## 🆘 Troubleshooting

### Issue: Deployment Failed
**Solution:** Check build logs for errors. Usually fixed by:
```bash
npm install
npm start
```
working locally first.

### Issue: Server keeps sleeping
**Solution:** Upgrade to paid plan ($7/month) for always-on service, or use a service like UptimeRobot to ping your site every 5 minutes.

### Issue: Can't access admin panel
**Solution:** Make sure you set the environment variables (ADMIN_USERNAME and ADMIN_PASSWORD) in Render dashboard.

---

## 💰 Pricing

- **Free Plan:** Perfect for testing and small traffic
- **Paid Plan:** $7/month for always-on service
- No credit card required for free plan!

---

## 📞 Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your GitHub Repo: https://github.com/Aarya0003/prakruthiws

---

## ✅ Checklist

Before going live, verify:
- [ ] Website loads correctly
- [ ] All 19 services display properly
- [ ] Request form submits successfully
- [ ] Admin panel login works
- [ ] Mobile responsive works
- [ ] No console errors

---

## 🎉 You're Done!

Your professional Prakruthi Driving School website is now live on the internet!

Share the URL with your client and celebrate! 🚀

---

**Built with ❤️ for Prakruthi Driving School**

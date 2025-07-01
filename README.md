# 🧮 TradingHub - Multi-Market Risk Management Calculator

A modern React/Next.js application for calculating optimal position sizes and managing trading risk across multiple global markets.

## 🌏 Supported Markets

- 🇲🇾 **Malaysia (KLSE)** - 100 shares per lot
- 🇸🇬 **Singapore (SGX)** - 100 shares per lot  
- 🇨🇳 **China A-Shares** - 100 shares per lot
- 🇭🇰 **Hong Kong (HKEX)** - Variable lot sizes
- 🇺🇸 **United States** - Any number of shares

## 🚀 Features

- **Multi-Market Support**: Calculate position sizes for 5 major markets
- **Risk Management**: Professional-grade position sizing calculations
- **Lot-Based Trading**: Accurate calculations for Asian markets (100 shares/lot)
- **Share-Based Trading**: Flexible calculations for US market
- **Dynamic Currency**: Displays in local currency (RM, S$, ¥, HK$, $)
- **Responsive Design**: Works perfectly on mobile and desktop
- **Real-Time Validation**: Smart warnings and error checking
- **Educational Content**: Built-in risk management principles

## 🎯 Core Functionality

### Risk Management Formula
```
Risk Amount = Principal × Risk Percentage
Maximum Shares = Risk Amount ÷ (Buy Price - Stop Loss)
Maximum Lots = Maximum Shares ÷ 100 (for lot-based markets)
Position Value = Maximum Shares × Buy Price
```

### Example Calculation
```
Principal: RM 10,000
Risk: 3%
Buy Price: RM 2.50
Stop Loss: RM 2.25

Result:
→ Risk Amount: RM 300
→ Maximum Lots: 12 lots (1,200 shares)
→ Position Value: RM 3,000
→ Position Size: 30% of capital
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth (ready for Google login)
- **Database**: Firebase Firestore (ready for user data)
- **Analytics**: Custom click tracking + Google Analytics ready
- **Deployment**: Vercel-optimized

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wjlim-14/tradinghub-risk-calculator.git
   cd react-investhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Firebase configuration (optional for basic functionality)

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🌐 Deployment

### Quick Deploy to Vercel
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Configuration

### Firebase Setup (Optional)
For user authentication and data storage:

1. Create a Firebase project
2. Enable Authentication with Google provider
3. Create Firestore database
4. Add your config to `.env.local`

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

## 📊 Usage Examples

### Conservative Trading (2% Risk)
- Principal: $50,000
- Risk: 2% ($1,000)
- Perfect for long-term investors

### Moderate Trading (3-5% Risk)  
- Principal: $20,000
- Risk: 3-5% ($600-1,000)
- Balanced risk/reward approach

### Position Sizing Best Practices
- Never risk more than 2-5% per trade
- Diversify across multiple positions
- Always set stop losses before buying
- Consider market-specific lot requirements

## 🔍 Market-Specific Notes

### Asian Markets (MY, SG, CN)
- Standard 100 shares per lot
- Must buy in full lots only
- Calculator automatically rounds down

### Hong Kong (HK)
- Variable lot sizes (10 to 100,000 shares)
- Check individual stock requirements
- Calculator defaults to 100 shares

### United States (US)
- No lot restrictions
- Fractional shares supported
- Any number of shares allowed

## 🎨 Customization

### Adding New Markets
1. Update market selector in `RiskCalculator.tsx`
2. Add market info in `getMarketInfo()` function
3. Update trading rules in `MarketTradingRules.tsx`

### Styling Changes
Edit `tailwind.config.js` for colors and themes:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#your-color'
      }
    }
  }
}
```

## 📈 Performance

- **Lighthouse Score**: 95+
- **Core Web Vitals**: Optimized
- **Bundle Size**: ~254KB first load
- **SEO**: Fully optimized with meta tags

## 🔐 Security

- Input validation and sanitization
- XSS protection with Next.js
- Environment variable protection
- Firebase security rules ready

## 📞 Support

- **Issues**: Create GitHub issue
- **Features**: Submit feature request
- **Documentation**: Check README and code comments

## 📄 License

Open source - MIT License

---

## 🎯 Perfect For

- **Day Traders**: Quick position sizing calculations
- **Swing Traders**: Risk management for longer holds  
- **Investors**: Portfolio allocation decisions
- **Educational**: Learning proper risk management
- **Multi-Market**: Trading across different exchanges

**Start managing your trading risk professionally! 🚀**

export class PricingFakeData {
  public static data = {
    pricing: {
      basicPlan: {
        title: 'Basic',
        img: 'assets/images/illustration/Pot1.svg',
        subtitle: 'A simple start for everyone',
        monthlyPrice: 0,
        yearlyPlan: {
          perMonth: 0,
          totalAnual: 0
        },
        planBenefits: [
          '100 responses a month',
          'Unlimited forms and surveys',
          'Unlimited fields',
          'Basic form creation tools',
          'Up to 2 subdomains'
        ],
        popular: false
      },
      standardPlan: {
        title: 'Standard',
        img: 'assets/images/illustration/Pot2.svg',
        subtitle: 'For small to medium businesses',
        monthlyPrice: 49,
        yearlyPlan: {
          perMonth: 40,
          totalAnual: 480
        },
        planBenefits: [
          'Unlimited responses',
          'Unlimited forms and surveys',
          'Instagram profile page',
          'Google Docs integration',
          'Custom “Thank you” page'
        ],
        popular: true
      },
      enterprisePlan: {
        title: 'Enterprise',
        img: 'assets/images/illustration/Pot3.svg',
        subtitle: 'Solution for big organizations',
        monthlyPrice: 99,
        yearlyPlan: {
          perMonth: 80,
          totalAnual: 960
        },
        planBenefits: [
          'PayPal payments',
          'Logic Jumps',
          'File upload with 5GB storage',
          'Custom domain support',
          'Stripe integration'
        ],
        popular: false
      },
      qandA: [
        {
          question: 'What is staking?',
          ans: 'Like a lot of things in crypto, staking can be a complicated idea or a simple one depending on how many levels of understanding you want to unlock. For a lot of traders and investors, knowing that staking is a way of earning rewards for holding certain cryptocurrencies is the key takeaway. But even if you’re just looking to earn some staking rewards, it’s useful to understand at least a little bit about how and why it works the way it does'
        },
        {
          question: 'How does staking work?',
          ans:
            'If a cryptocurrency you own allows staking — current options include Tezos, Cosmos, and now Ethereum (via the new ETH2 upgrade) — you can “stake” some of your holdings and earn a percentage-rate reward over time. This usually happens via a “staking pool” which you can think of as being similar to an interest-bearing savings account. 

The reason your crypto earns rewards while staked is because the blockchain puts it to work. Cryptocurrencies that allow staking use a “consensus mechanism” called Proof of Stake, which is the way they ensure that all transactions are verified and secured without a bank or payment processor in the middle. Your crypto, if you choose to stake it, becomes part of that process. 

(Get all the info you need to understand the transition to ETH2 in our guide to all things Ethereum.)'
        },
        {
          question: 'Do I need to stake again after yield?',
          ans:
            'Yes you do.'
        }
      ]
    }
  };
}

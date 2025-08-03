import { Component } from '@angular/core';
import { NbLayoutScrollService } from '@nebular/theme';

type StatValue = {
  index: number;
  icon: string;
  value: number;
  text: string;
}

export type FeatureContent = {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  reversed?: boolean;
  fetureDetails: FeatureDetail[];
  buttonText: string;
  id: string;
}

export type FeatureDetail = {
  icon: string;
  title: string;
  description: string;
  image: string;
  
}

@Component({
  selector: 'ls-lp-content',
  templateUrl: './lp-content.component.html',
  styleUrls: ['./lp-content.component.scss']
})
export class LpContentComponent {

  stats: StatValue[] = [
    { index: 0, icon: 'home-outline', value: 39_000, text: 'Institutions' },
    { index: 1, icon: 'person-outline', value: 10_000_000, text: 'Authors' },
    { index: 2, icon: 'book-outline', value: 6_000_000, text: 'Articles' },
    { index: 3, icon: 'pricetags-outline', value: 150_000, text: 'Topics' },
    { index: 4, icon: 'briefcase-outline', value: 125_000, text: 'Companies' },
    { index: 5, icon: 'globe-2-outline', value: 20_000, text: 'Funding & Tenders' },
    
  ];

  features: FeatureContent[] = [
    {
      title: 'Map Your Research Ecosystem',
      subtitle: 'Go Beyond Search. Visualize Connections.',
      description: 'Stop guessing and start seeing. Our dynamic visualizations allow you to navigate the entire research landscape, revealing hidden patterns, key influencers, and strategic opportunities that simple data tables and search bars could never show you.',
      link: 'network',
      buttonText: 'Explore the Network',
      id: "data-visualization",
      fetureDetails: [
        {
          icon: 'radio-button-on-outline',
          title: 'Visual Network Mapping',
          description: 'Connect researchers, institutions, and publications to see how ideas flow through the ecosystem.',
          image: 'assets/images/landing/1_Network.png'
        },
        {
          icon: 'loader-outline',
          title: 'Snowballing Techniques',
          description: 'Start with one paper and discover entire research lineages through smart citation exploration.',
          image: 'assets/images/landing/2_topic_page.png'
        },
        {
          icon: 'bookmark-outline',
          title: 'Save & Organize',
          description: 'Bookmark papers and researchers in personalized collections for easy reference and tracking.',
          image: 'assets/images/landing/3_researcher_page.png'
        },
        {
          icon: 'book-open-outline',
          title: 'Rapid SOTA Understanding',
          description: 'Bookmark papers and researchers in personalized collections for easy reference and tracking.',
          image: 'assets/images/landing/4_Rapid_SOTA.png'
        }
      ]
    },

    {
      title: 'Intelligent Team & Funding Matchmaking',
      subtitle: 'From Team Gaps to EU Grants, Automatically.',
      description: 'Assemble the perfect project team with our AI-powered generator. Our system not only identifies ideal experts to fill collaboration gaps but also automatically recommends relevant EU funding opportunities. Invite applicants to your project and let our AI rank them by compatibility, ensuring you build the strongest possible consortium.',
      link: 'team-builder',
      buttonText: 'Build Your Team',
      reversed: true,
      id: "matchmaking",
      fetureDetails: [
        {
          icon: 'radio-button-on-outline',
          title: 'AI Team Generator',
          description: 'AI-driven generator builds balanced or innovation-focused teams',
          image: 'assets/images/landing/5_team_matchmaking.png'
        },
        {
          icon: 'loader-outline',
          title: 'Funding Opportunities',
          description: 'Automated detection of relevant Horizon Europe funding calls.',
          image: 'assets/images/landing/6_funding_matchmaking.svg'
        },
        {
          icon: 'checkmark-square-outline',
          title: 'Smart Ranking',
          description: 'Invite and automatically rank project applicants with an AI-powered compatibility score.',
          image: 'assets/images/landing/7_expertise.svg'
        },
        {
          icon: 'file-add-outline',
          title: 'Gap Analysis',
          description: 'Identify and fill expertise gaps in your team with targeted expert suggestions.',
          image: 'assets/images/landing/8_Applicant_selection.png'
        }
      ]
    },
    {
      title: 'From Raw Data to Strategic Insight, Instantly',
      subtitle: 'Turn Months of Manual Research into Minutes of Analysis',
      description: 'Stop wrestling with fragmented data and costly market research. Our platform condenses hundreds of academic papers into clear, actionable reports. Uncover emerging trends, track key players, and make data-driven decisions with affordable, automated insights at your fingertips.',
      link: 'trend-report',
      buttonText: 'Generate Your First Report',
      id: "trend-reports",
      fetureDetails: [
        {
          icon: 'file-text-outline',
          title: 'Data Condensation',
          description: 'Condense hundreds of papers into a single, clear report.',
          image: 'assets/images/landing/report-demo-1.png'
        },
        {
          icon: 'printer-outline',
          title: 'Custom Reports',
          description: 'Customize reports for market analysis, technical deep-dives, or institutional research.',
          image: 'assets/images/landing/report-demo-2.png'
        },
        {
          icon: 'trending-up-outline',
          title: 'Research Tracking',
          description: 'Track research trajectories and identify key players and institutions in any field.',
          image: 'assets/images/landing/report-demo-3.png'
        },
        {
          icon: 'pricetags-outline',
          title: 'Affordable Insights',
          description: 'Get affordable, automated insights without the high cost of traditional reports.',
          image: 'assets/images/landing/report-demo-4.png'
        }
      ]
    }
  ]

  constructor(private viewportScroller: NbLayoutScrollService) {}

  async scrollOneScreenDown(): Promise<void> {
    // Get the current vertical scroll position
    await this.viewportScroller.getPosition().subscribe(position => {
      const newScrollPosition = position.y + window.innerHeight;
      this.viewportScroller.scrollTo(0, newScrollPosition);
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('de-DE');
};

}

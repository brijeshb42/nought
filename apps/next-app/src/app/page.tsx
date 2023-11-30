import Image from 'next/image';
import { style } from '@nought/css';
import { Button } from '@nought/ui';
import { globalTheme } from '../styles/theme';
import styles from './page.module.css';

const mainClass = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6rem',
  minHeight: '100vh',
});

const descriptionClass = style({
  display: 'inherit',
  justifyContent: 'inherit',
  alignItems: 'inherit',
  fontSize: '0.85rem',
  maxWidth: globalTheme.size.maxWidth,
  width: '100%',
  zIndex: '2',
  fontFamily: globalTheme.font.mono,
  selectors: {
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
    },
    '& p': {
      position: 'relative',
      margin: '0',
      padding: '1rem',
      backgroundColor: `rgba(${globalTheme.palette.callout.baseRgb}, 0.5)`,
      border: `1px solid rgba(${globalTheme.palette.callout.borderRgb}, 0.3)`,
      borderRadius: globalTheme.borderRadius,
    },
  },
  '@media': {
    '(max-width: 700px)': {
      fontSize: '0.8rem',
      selectors: {
        '& a': {
          padding: '1rem',
        },
        '& p, & div': {
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          width: '100%',
        },
        '& p': {
          alignItems: 'center',
          inset: '0 0 auto',
          padding: '2rem 1rem 1.4rem',
          borderRadius: 0,
          border: 'none',
          borderBottom: `1px solid rgba(${globalTheme.palette.callout.borderRgb}, 0.25)`,
          background: `linear-gradient(
      to bottom,
      rgba(${globalTheme.palette.background.startRgb}, 1),
      rgba(${globalTheme.palette.callout.baseRgb}, 0.5)
    )`,
          backgroundClip: 'padding-box',
          backdropFilter: 'blur(24px)',
        },
        '& div': {
          alignItems: 'flex-end',
          pointerEvents: 'none',
          inset: 'auto 0 0',
          padding: '2rem',
          height: '200px',
          background: `linear-gradient(
      to bottom,
      transparent 0%,
      rgb(${globalTheme.palette.background.endRgb}) 40%
    )`,
          zIndex: 1,
        },
      },
    },
  },
});

const codeClass = style({
  fontWeight: 700,
  fontFamily: globalTheme.font.mono,
});

const cardClass = style({
  padding: '1rem 1.2rem',
  borderRadius: globalTheme.borderRadius,
  background: `rgba(${globalTheme.palette.card.baseRgb}, 0)`,
  border: `1px solid rgba(${globalTheme.palette.card.borderRgb}, 0)`,
  transition: 'background 200ms, border 200ms',
  selectors: {
    '& span': {
      display: 'inline-block',
      transition: 'transform 200ms',
    },
    '& h2': {
      fontWeight: 600,
      marginBottom: '0.7rem',
    },
    '& p': {
      margin: 0,
      opacity: 0.6,
      fontSize: '0.9rem',
      lineHeight: 1.5,
      maxWidth: '30ch',
    },
  },
  '@media': {
    '(hover: hover) and (pointer: fine)': {
      selectors: {
        '&:hover': {
          background: `rgba(${globalTheme.palette.card.baseRgb}, 0.05)`,
          border: `1px solid rgba(${globalTheme.palette.card.borderRgb}, 0.1)`,
        },
        '&:hover span': {
          transform: 'translateX(4px)',
        },
      },
    },
    '(prefers-reduced-motion)': {
      selectors: {
        '&:hover span': {
          transform: 'none',
        },
      },
    },
    '(max-width: 700px)': {
      padding: '1rem 2.5rem',
      selectors: {
        '& h2': {
          marginBottom: '0.5rem',
        },
      },
    },
  },
});

const centerClass = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: '4rem 0',
  selectors: {
    '&::before': {
      background: globalTheme.palette.glow.secondary,
      borderRadius: '50%',
      width: 480,
      height: 360,
      marginLeft: -400,
    },
    '&::after': {
      background: globalTheme.palette.glow.primary,
      width: 240,
      height: 180,
      zIndex: -1,
    },
    '&::before,&::after': {
      content: "''",
      left: '50%',
      position: 'absolute',
      filter: 'blur(45px)',
      transform: 'translateZ(0)',
    },
  },
  '@media': {
    '(max-width: 700px)': {
      padding: '8rem 0 6rem',
      selectors: {
        '&::before': {
          transform: 'none',
          height: 300,
        },
      },
    },
  },
});

const gridClass = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(25%, auto))',
  maxWidth: '100%',
  width: globalTheme.size.maxWidth,
  '@media': {
    '(max-width: 700px)': {
      gridTemplateColumns: '1fr',
      marginBottom: '120px',
      maxWidth: '320px',
      textAlign: 'center',
    },
    '(min-width: 701px) and (max-width: 1120px)': {
      gridTemplateColumns: 'repeat(2, 50%)',
    },
  },
});

export default function Home() {
  return (
    <main className={mainClass}>
      <Button>Button</Button>
      <div className={descriptionClass}>
        <p>
          Get started by editing&nbsp;
          <code className={codeClass}>src/app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={centerClass}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={gridClass}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}

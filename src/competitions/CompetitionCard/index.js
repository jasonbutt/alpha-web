import React from 'react';
import PropTypes from 'prop-types';
import ellipsis from 'text-ellipsis';
import { Link } from 'react-router-dom';

import PostUserMeta from '../../post/PostUserMeta';
import CompetitionMeta from '../CompetitionMeta';
import CTAButton from './CTAButton';

import styles from './styles.scss';
import indexStyles from '../../styles/globals.scss';

const CompetitionCard = ({ competition }) => (
  <div className={`${indexStyles.white} ${styles.container}`}>
    <PostUserMeta
      created={competition.created_at.substr(0, 19)}
      communities={competition.communities}
      profile={{
        username: competition.user.username,
        name: competition.user.username,
      }}
    />

    <Link to={`/competitions/${competition.id}`}>
      {
        competition.image && (
          <div
            style={{ backgroundImage: `url("${competition.image}")` }}
            className={styles.competitionImage}
          />
        )
      }

      <div className={styles.contentContainer}>
        <div className={styles.title}>
          {competition.title}
        </div>

        <CompetitionMeta
          prizes={competition.prizes}
          startsAt={competition.starts_at}
          endsAt={competition.ends_at}
          participantCount={competition.participant_count}
        />

        <p className={styles.description}>
          {ellipsis(competition.description, 182)}
        </p>

        <div className={styles.ctaContainer}>
          <CTAButton
            startsAt={competition.starts_at}
            endsAt={competition.ends_at}
            winnersAnnounced={competition.winners_announced}
            // participating tag needed for participate button
            participatingTag={competition.participating_tag}
          />
        </div>
      </div>
    </Link>
  </div>
);

CompetitionCard.propTypes = {
  competition: PropTypes.shape({
    created_at: PropTypes.string,
    communities: PropTypes.arrayOf(PropTypes.shape()),
    user: PropTypes.shape(),
  }).isRequired,
};

export default CompetitionCard;

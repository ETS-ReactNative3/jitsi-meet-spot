import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { remoteNotification } from 'actions';
import { getAllNotifications } from 'reducers';

import Notification from './notification';
import styles from './notifications.css';

/**
 * The container for handling showing and dismissing notifications.
 *
 * @extends React.PureComponent
 */
export class Notifications extends React.PureComponent {
    static propTypes = {
        dispatch: PropTypes.func,
        notifications: PropTypes.array
    };

    static defaultProps = {
        notifications: []
    };

    /**
     * Sets a timeout to automatically clear notifications.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._setTimeoutForNewNotifications(this.props.notifications);
    }

    /**
     * Sets a timeout to automatically clear new notifications.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const newNotifications = this.props.notifications.filter(notification =>
            !prevProps.notifications.includes(notification));

        this._setTimeoutForNewNotifications(newNotifications);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const hasNotificationsClass = this.props.notifications.length
            ? styles.with_notifications : styles.without_notifications;
        const className = `${styles.notifications} ${hasNotificationsClass}`;

        return (
            <div className = { className }>
                { this._renderNotifications() }
            </div>
        );
    }

    /**
     * Creates an instance of {@code Notification} for each notification.
     *
     * @private
     * @returns {Array<ReactElement>}
     */
    _renderNotifications() {
        return this.props.notifications.map(notification =>
            <Notification
                key = { notification.id }
                message = { notification.message }
                type = { notification.type } />);
    }

    /**
     * Creates a timeout to automatically hide passed-in notifications.
     *
     * @param {Array<Object>} notifications
     * @private
     * @returns {void}
     */
    _setTimeoutForNewNotifications(notifications) {
        notifications.forEach(({ id }) => {
            setTimeout(() => {
                this.props.dispatch(remoteNotification(id));
            }, 5000);
        });
    }
}

/**
 * Selects parts of the Redux state to pass in with the props of
 * {@code Notifications}.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Object}
 */
function mapStateToPros(state) {
    return {
        notifications: getAllNotifications(state)
    };
}

export default connect(mapStateToPros)(Notifications);
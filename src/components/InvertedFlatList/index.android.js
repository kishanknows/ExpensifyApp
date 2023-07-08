import React, {forwardRef} from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import BaseInvertedFlatList from './BaseInvertedFlatList';
import stylePropTypes from '../../styles/stylePropTypes';
import CellRendererComponent from './CellRendererComponent';

const propTypes = {
    /** Passed via forwardRef so we can access the FlatList ref */
    innerRef: PropTypes.shape({
        current: PropTypes.instanceOf(FlatList),
    }).isRequired,

    /** The style of the footer of the list */
    ListFooterComponentStyle: stylePropTypes,
};

const defaultProps = {
    ListFooterComponentStyle: {},
};

class InvertedFlatList extends React.Component {
    constructor(props) {
        super(props);

        this.list = undefined;
    }

    componentDidMount() {
        if (!_.isFunction(this.props.innerRef)) {
            // eslint-disable-next-line no-param-reassign
            this.props.innerRef.current = this.list;
        } else {
            this.props.innerRef(this.list);
        }
    }

    render() {
        return (
            <BaseInvertedFlatList
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...this.props}
                ref={(el) => (this.list = el)}
                // Manually invert the FlatList to circumvent a react-native bug that causes ANR (application not responding) on android 13
                inverted={false}
                style={styles.invert}
                ListFooterComponentStyle={[styles.invert, this.props.ListFooterComponentStyle]}
                verticalScrollbarPosition="left" // We are mirroring the X and Y axis, so we need to swap the scrollbar position
                CellRendererComponent={CellRendererComponent}

                /**
                 * To achieve absolute positioning and handle overflows for list items, the property must be disabled
                 * for Android native builds.
                 * Source: https://reactnative.dev/docs/0.71/optimizing-flatlist-configuration#removeclippedsubviews
                 */
                removeClippedSubviews={false}
            />
        );
    }
}
InvertedFlatList.propTypes = propTypes;
InvertedFlatList.defaultProps = defaultProps;

export default forwardRef((props, ref) => (
    <InvertedFlatList
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        innerRef={ref}
    />
));

import React from 'react';
import { connect } from 'react-redux';

import { middleware, RESOLVED, PENDING, REJECTED } from '../util/middleware-decorator';
import FallbackImage from '../components/FallbackImage';

@connect(state => state)
@middleware([])
export default class extends React.Component {

    render() {
        const { contestants, params } = this.props;
        const contestant = contestants[`contestant:${params.contestant}`];

        return (
            <div className="view-contestant">

                <div className="stats">
                    <div>
                        <img src={contestant.data.images.body} />
                        <h1>{contestant.data.name}</h1>
                    </div>
                    <div>
                        <table>
                            <tbody>
                                {contestant.data.bioStats.map(data => (
                                    <tr>
                                        <td>{data.name}</td>
                                        <td>{data.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <hr />
                <div className="questions">
                    {contestant.data.bioQuestions.map(data => (
                        <div>
                            <h3>{data.question}</h3>
                            <p>{data.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

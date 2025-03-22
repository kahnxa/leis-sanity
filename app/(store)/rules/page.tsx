export default function RulesPage() {
  return (
    <div className="container mx-auto p-6 font-['Helvetica_Neue']">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Leis: The Official Rulebook
      </h1>
      <p className="text-lg text-center italic mb-6">
        A Leisurely Game of Gentlemen's Dinks
      </p>
      <hr className="mb-6" />

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold">Objective</h2>
          <p>
            The goal of Leis is to eliminate all liquid in your opponents’ pint
            glasses by scoring a total of <strong>8 points</strong> (4 per
            glass). Points are earned by:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Sinking</strong> the ball in a cup (2 points)
            </li>
            <li>
              <strong>Dinking</strong> the lip of the cup with an{" "}
              <em>upward</em> bounce (1 point)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Equipment</h2>
          <ul className="list-disc pl-6">
            <li>1 ping pong table</li>
            <li>1 ping pong ball</li>
            <li>4 paddles (1 per player)</li>
            <li>4 pint glasses (2 per side)</li>
            <li>Beverage of choice (typically beer)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Table Setup</h2>
          <ul className="list-disc pl-6">
            <li>
              Place 2 pint glasses near the back edge of each side, parallel to
              the edge and adjacent to each other.
            </li>
            <li>
              Each cup must be placed one paddle-length from the back edge.
            </li>
            <li>
              Corners of the table are labeled clockwise:{" "}
              <strong>
                α (top-left), ω (top-right), δ (bottom-right), θ (bottom-left)
              </strong>
              .
            </li>
            <li>Side A and Side B are fixed scoring sides for each team.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Teams and Roles</h2>
          <ul className="list-disc pl-6">
            <li>2 teams of 2 players.</li>
            <li>Each team has a fixed scoring side.</li>
            <li>
              One player acts as the <strong>Setter</strong>, the other as the{" "}
              <strong>Scorer</strong>.
            </li>
            <li>
              During serves: one team has a <strong>Server</strong> and an{" "}
              <strong>Obstructor</strong>.
            </li>
            <li>
              When a team scores 4 points against their opponents, they switch
              sides and roles.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Serving</h2>
          <ul className="list-disc pl-6">
            <li>
              The Server stands at corner <strong>ω</strong>.
            </li>
            <li>
              The Obstructor stands upright on the opposite side, one
              paddle-length from the back edge, torso nearly touching the table.
              They may not move during the serve.
            </li>
            <li>The serve must:</li>
            <ul className="list-disc pl-8">
              <li>Bounce once on the server’s side.</li>
              <li>
                Reach at least nipple height as it enters the opposing side.
              </li>
              <li>Bounce once on the receiving side.</li>
            </ul>
            <li>If the serve hits the Obstructor, it is still valid.</li>
            <li>
              <strong>Faults:</strong>
            </li>
            <ul className="list-disc pl-8">
              <li>First fault: retry.</li>
              <li>
                Second fault (double fault): server's team drinks{" "}
                <strong>¼ cup</strong> (1 point).
              </li>
            </ul>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Gameplay and Scoring</h2>
          <p>After a valid serve:</p>
          <ol className="list-decimal pl-6">
            <li>The returner sends the ball to their setter.</li>
            <li>The setter sets up the scorer.</li>
            <li>The scorer attempts to score:</li>
            <ul className="list-disc pl-8">
              <li>Sink (ball in cup): 2 points, both opponents drink ½ cup.</li>
              <li>
                Dink (ball hits lip and bounces <em>up</em>): 1 point.
              </li>
              <li>
                Dink <em>downward</em>: no point.
              </li>
            </ul>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Game-Ending Foul</h2>
          <p>
            If a player knocks over a glass during gameplay, their team
            automatically loses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Victory Conditions</h2>
          <ul className="list-disc pl-6">
            <li>A team wins by scoring 8 total points.</li>
            <li>
              A <strong>shutout</strong> occurs if one team wins without
              drinking.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Spirit of the Game</h2>
          <ul className="list-disc pl-6">
            <li>No spiking (paddle angle must be &lt; 90°).</li>
            <li>
              Obstructors with anatomical advantages (e.g., chest size) are
              tactically favored.
            </li>
            <li>
              All disputes (e.g., dink direction) are resolved by majority vote
              or common vibe.
            </li>
            <li>Honor the code of Leis. Be vigorous, not violent.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

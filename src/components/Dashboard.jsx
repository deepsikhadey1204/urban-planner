import "../styles/Dashboard.css";

export default function Dashboard({ selectedAreaData }) {
  if (!selectedAreaData) {
    return (
      <div className="dashboard-empty">
        <h2>No area selected</h2>
        <p>Select an area from the map to view its analysis.</p>
      </div>
    );
  }

  const { hospitals = [], roads = [], subdistricts = [] } = selectedAreaData;

  // --------------------------------
  // Aggregate subdistrict data
  // --------------------------------

  const totalPopulation = subdistricts.reduce(
    (total, feature) => total + Number(feature.attributes.total_popu || 0),
    0,
  );

  const totalHouseholds = subdistricts.reduce(
    (total, feature) => total + Number(feature.attributes.total_hous || 0),
    0,
  );

  const forestArea = subdistricts.reduce(
    (total, feature) => total + Number(feature.attributes.forest_are || 0),
    0,
  );

  const agriculturalArea = subdistricts.reduce(
    (total, feature) => total + Number(feature.attributes.net_area_s || 0),
    0,
  );

  const irrigatedArea = subdistricts.reduce(
    (total, feature) => total + Number(feature.attributes.area_irrig || 0),
    0,
  );

  const barrenArea = subdistricts.reduce(
    (total, feature) => total + Number(feature.attributes.barren_un_ || 0),
    0,
  );

  // --------------------------------
  // Helpers
  // --------------------------------

  const formatNumber = (number) => Number(number).toLocaleString("en-IN");

  const getSubdistrictName = (feature, index) => {
    const attr = feature.attributes;

    return (
      attr.subdistrict_name ||
      attr.subdist_name ||
      attr.sd_name ||
      attr.SUBDIST_NM ||
      `Subdistrict ${index + 1}`
    );
  };

  return (
    <div className="dashboard">
      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>Area Overview</h1>
          <p> Key statistics and land information for your selected area </p>
        </div>

        <div className="selected-area-card">
          <div>
            <span className="selected-area-label"> Selected Area </span>
            <strong> Custom Selected Area</strong>
            <small> {subdistricts.length} subdistricts </small>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon population-icon"> 👥 </div>
          <div>
            <span>Population</span>
            <strong> {formatNumber(totalPopulation)} </strong>
            <small> Across intersecting subdistricts </small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon household-icon"> 🏠 </div>
          <div>
            <span>Households</span>
            <strong> {formatNumber(totalHouseholds)} </strong>
            <small> Across intersecting subdistricts </small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon hospital-icon"> ✚ </div>
          <div>
            <span>Hospitals</span>
            <strong>{formatNumber(hospitals.length)} </strong>
            <small>Intersecting selected area</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon road-icon"> ╱</div>
          <div>
            <span>Road Segments</span>
            <strong> {formatNumber(roads.length)} </strong>
            <small> Intersecting selected area </small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon subdistrict-icon"> ▦ </div>
          <div>
            <span>Subdistricts</span>
            <strong>{subdistricts.length}</strong>
            <small>Intersecting selection</small>
          </div>
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="dashboard-card land-card">
          <div className="card-title">
            <span>◈</span> <h2>Land Information</h2>
          </div>
          <div className="land-list">
            <LandRow label="Agricultural Area" value={agriculturalArea} />
            <LandRow label="Forest Area" value={forestArea} />
            <LandRow label="Irrigated Area" value={irrigatedArea} />
            <LandRow label="Barren / Unused Area" value={barrenArea} />
          </div>
        </div>
        {/* KEY INFORMATION */}

        <div className="dashboard-card">
          <div className="card-title">
            <span>▥</span>
            <h2>Infrastructure</h2>
          </div>
          <div className="infrastructure-list">
            <div className="infrastructure-item">
              <div className="info-icon"> ✚ </div>
              <div>
                <span>Hospitals</span>
                <strong> {hospitals.length} </strong>
              </div>
            </div>
            <div className="infrastructure-item">
              <div className="info-icon"> ╱ </div>
              <div>
                <span>Road Segments</span>
                <strong> {roads.length} </strong>
              </div>
            </div>
            <div className="infrastructure-item">
              <div className="info-icon"> 👥 </div>
              <div>
                <span>Population / Household</span>

                <strong>
                  {totalHouseholds
                    ? (totalPopulation / totalHouseholds).toFixed(1)
                    : "—"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* INSIGHTS */}

        <div className="dashboard-card insights-card">
          <div className="card-title">
            <span>💡</span>
            <h2>Key Information</h2>
          </div>

          <div className="insight">
            <div className="insight-icon">👥</div>

            <div>
              <strong>Population</strong>

              <p>
                {formatNumber(totalPopulation)} people across{" "}
                {subdistricts.length} intersecting subdistricts.
              </p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-icon">✚</div>

            <div>
              <strong>Healthcare</strong>
              <p>{hospitals.length} hospitals intersect the selected area.</p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-icon">🌾</div>

            <div>
              <strong>Agricultural Land</strong>

              <p>
                {formatNumber(agriculturalArea)} ha recorded across the
                intersecting subdistricts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUBDISTRICT TABLE */}

      <div className="dashboard-card table-card">
        <div className="card-title">
          <span>▦</span>

          <h2>Subdistrict-wise Summary</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Subdistrict</th>
                <th>Population</th>
                <th>Households</th>
                <th>Forest Area</th>
                <th>Agricultural Area</th>
                <th>Irrigated Area</th>
                <th>Barren Area</th>
              </tr>
            </thead>

            <tbody>
              {subdistricts.map((feature, index) => {
                const attr = feature.attributes;

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{getSubdistrictName(feature, index)}</td>

                    <td>{formatNumber(attr.total_popu || 0)}</td>

                    <td>{formatNumber(attr.total_hous || 0)}</td>

                    <td>{formatNumber(attr.forest_are || 0)}</td>

                    <td>{formatNumber(attr.net_area_s || 0)}</td>

                    <td>{formatNumber(attr.area_irrig || 0)}</td>

                    <td>{formatNumber(attr.barren_un_ || 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------
   Reusable land row
-------------------------------- */

function LandRow({ label, value }) {
  return (
    <div className="land-row">
      <span>{label}</span>

      <strong>{Number(value).toLocaleString("en-IN")} ha</strong>
    </div>
  );
}

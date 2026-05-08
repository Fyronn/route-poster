using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblRoller
{
    public int RolId { get; set; }

    public string RolKodu { get; set; } = null!;

    public string RolAdi { get; set; } = null!;

    public virtual ICollection<TblKullanicilar> TblKullanicilars { get; set; } = new List<TblKullanicilar>();
}
